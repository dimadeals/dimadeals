// ============ MESSAGES API ============
// Handles contact form submissions with guaranteed JSON responses.
// Messages are stored one key per message (race-free) with backward-compatible
// reading of the old single-blob format.

import { getRedis, isAdminRequest } from "./redis.js";

const LEGACY_MESSAGES_KEY = "contact:messages";
const MESSAGE_KEY_PREFIX = "contact:message:";

function setCommonHeaders(res) {
  const corsOrigin = process.env.ADMIN_ORIGIN;
  if (corsOrigin) res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
}

function parseArray(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Stored messages are corrupted:", error);
    return [];
  }
}

async function scanKeys(redis, match) {
  const keys = [];
  let cursor = "0";
  do {
    const result = await redis.scan(cursor, { MATCH: match, COUNT: 200 });
    cursor = String(result.cursor || "0");
    keys.push(...result.keys);
  } while (cursor !== "0");
  return keys;
}

async function readMessages(redis) {
  const byId = new Map();

  // Legacy single JSON array (read-only support for existing data)
  const legacy = parseArray(await redis.get(LEGACY_MESSAGES_KEY));
  for (const message of legacy) {
    if (message && message.id !== undefined) byId.set(String(message.id), message);
  }

  // Current per-message keys
  const keys = await scanKeys(redis, `${MESSAGE_KEY_PREFIX}*`);
  if (keys.length > 0) {
    const values = await redis.mGet(keys);
    for (const raw of values) {
      if (!raw) continue;
      try {
        const message = JSON.parse(raw);
        if (message && message.id !== undefined) byId.set(String(message.id), message);
      } catch { /* skip corrupted entry */ }
    }
  }

  return [...byId.values()];
}

/**
 * Main handler - routes requests based on HTTP method
 * ALL responses are guaranteed to be valid JSON
 */
export default async function handler(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    setCommonHeaders(res);
    if (req.method === "OPTIONS") return res.status(200).end();

    switch (req.method) {
      case "POST":
        return await handlePost(req, res);
      case "GET":
        return await handleGet(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: "Method not allowed. Use POST, GET, or DELETE.",
        });
    }
  } catch (error) {
    console.error("Unhandled API error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

/**
 * POST: Save contact message from public
 */
async function handlePost(req, res) {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, and message",
      });
    }
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Name must be a non-empty string" });
    }
    if (typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Email must be a non-empty string" });
    }
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Message must be a non-empty string" });
    }

    const cleanName = name.trim().substring(0, 100);
    const cleanEmail = email.trim().toLowerCase().substring(0, 254);
    const cleanMessage = message.trim().substring(0, 5000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const messageData = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    try {
      const redis = await getRedis();
      // One key per message: concurrent submissions cannot overwrite each other.
      await redis.set(`${MESSAGE_KEY_PREFIX}${messageData.id}`, JSON.stringify(messageData));

      return res.status(200).json({
        success: true,
        message: "Message received! We will contact you soon.",
        data: messageData,
      });
    } catch (storageError) {
      console.error("Redis error during POST:", storageError);
      return res.status(500).json({ success: false, error: "Failed to save message to database" });
    }
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return res.status(500).json({ success: false, error: "Server error while processing message" });
  }
}

/**
 * GET: Retrieve all messages (admin only)
 */
async function handleGet(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ success: false, error: "Unauthorized - invalid or missing admin key" });
    }

    try {
      const redis = await getRedis();
      const allMessages = await readMessages(redis);
      allMessages.sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));

      return res.status(200).json({ success: true, total: allMessages.length, messages: allMessages });
    } catch (storageError) {
      console.error("Redis error during GET:", storageError);
      return res.status(500).json({ success: false, error: "Failed to fetch messages from database" });
    }
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return res.status(500).json({ success: false, error: "Server error while retrieving messages" });
  }
}

/**
 * DELETE: Delete a message (admin only)
 */
async function handleDelete(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ success: false, error: "Unauthorized - invalid or missing admin key" });
    }

    const id = req.query?.id || req.body?.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Message ID is required (use ?id=... or body.id)",
      });
    }

    try {
      const redis = await getRedis();
      const key = `${MESSAGE_KEY_PREFIX}${id}`;
      let deleted = await redis.del(key);

      // Legacy messages live in one array; remove them there too.
      if (!deleted) {
        const legacy = parseArray(await redis.get(LEGACY_MESSAGES_KEY));
        const filtered = legacy.filter((m) => String(m.id) !== String(id));
        if (filtered.length !== legacy.length) {
          await redis.set(LEGACY_MESSAGES_KEY, JSON.stringify(filtered));
          deleted = 1;
        }
      }

      if (!deleted) {
        return res.status(404).json({ success: false, error: `Message with ID "${id}" not found` });
      }

      return res.status(200).json({
        success: true,
        message: "Message deleted successfully",
        deletedId: id,
      });
    } catch (storageError) {
      console.error("Redis error during DELETE:", storageError);
      return res.status(500).json({ success: false, error: "Failed to delete message from database" });
    }
  } catch (error) {
    console.error("DELETE /api/messages error:", error);
    return res.status(500).json({ success: false, error: "Server error while deleting message" });
  }
}
