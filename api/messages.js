// ============ MESSAGES API ============
// Handles contact form submissions with guaranteed JSON responses

import { getRedis } from './redis.js';

const ADMIN_KEY = process.env.ADMIN_KEY || 'your-secret-admin-key-here';
const MESSAGES_KEY = 'contact:messages';

/**
 * Validate admin authorization
 * @param {Object} req - Express request object
 * @returns {boolean} True if authorized, false otherwise
 */
function validateAdmin(req) {
  const auth = req.headers.authorization;
  return auth && auth === ADMIN_KEY;
}

/**
 * Main handler - routes requests based on HTTP method
 * ALL responses are guaranteed to be valid JSON
 */
export default async function handler(req, res) {
  try {
    // Set JSON content type header
    res.setHeader('Content-Type', 'application/json');

    // Route by HTTP method
    switch (req.method) {
      case 'POST':
        return await handlePost(req, res);
      case 'GET':
        return await handleGet(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed. Use POST, GET, or DELETE.'
        });
    }
  } catch (error) {
    console.error('Unhandled API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * POST: Save contact message from public
 */
async function handlePost(req, res) {
  try {
    const { name, email, message } = req.body || {};

    // Validation: Check required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message'
      });
    }

    // Validation: Check field types and lengths
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Name must be a non-empty string'
      });
    }

    if (typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Email must be a non-empty string'
      });
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message must be a non-empty string'
      });
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Create message object
    const messageData = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Save to Redis
    try {
      const redis = await getRedis();
      const data = await redis.get(MESSAGES_KEY);
      const allMessages = data ? JSON.parse(data) : [];
      allMessages.push(messageData);
      await redis.set(MESSAGES_KEY, JSON.stringify(allMessages));

      return res.status(200).json({
        success: true,
        message: 'Message received! We will contact you soon.',
        data: messageData
      });
    } catch (storageError) {
      console.error('Redis error during POST:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to save message to database'
      });
    }
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while processing message'
    });
  }
}

/**
 * GET: Retrieve all messages (admin only)
 */
async function handleGet(req, res) {
  try {
    // Admin authorization
    if (!validateAdmin(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - invalid or missing admin key'
      });
    }

    try {
      const redis = await getRedis();
      const data = await redis.get(MESSAGES_KEY);
      const allMessages = data ? JSON.parse(data) : [];

      // Sort by date descending (newest first)
      allMessages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return res.status(200).json({
        success: true,
        total: allMessages.length,
        messages: allMessages
      });
    } catch (storageError) {
      console.error('Redis error during GET:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch messages from database'
      });
    }
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while retrieving messages'
    });
  }
}

/**
 * DELETE: Delete a message (admin only)
 */
async function handleDelete(req, res) {
  try {
    // Admin authorization
    if (!validateAdmin(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - invalid or missing admin key'
      });
    }

    // Get message ID from query or body
    const id = req.query.id || req.body?.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Message ID is required (use ?id=... or body.id)'
      });
    }

    try {
      const redis = await getRedis();
      const data = await redis.get(MESSAGES_KEY);
      const allMessages = data ? JSON.parse(data) : [];

      // Find and filter out the message
      const filtered = allMessages.filter(m => String(m.id) !== String(id));

      // Check if message was actually found
      if (filtered.length === allMessages.length) {
        return res.status(404).json({
          success: false,
          error: `Message with ID "${id}" not found`
        });
      }

      // Save updated list
      await redis.set(MESSAGES_KEY, JSON.stringify(filtered));

      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
        deletedId: id
      });
    } catch (storageError) {
      console.error('Redis error during DELETE:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete message from database'
      });
    }
  } catch (error) {
    console.error('DELETE /api/messages error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while deleting message'
    });
  }
}


