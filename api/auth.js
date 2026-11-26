import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time check of the admin Authorization header.
 * Fails closed when ADMIN_KEY is not configured.
 */
export function isAdminRequest(req) {
  const expected = process.env.ADMIN_KEY;
  const provided = req.headers?.authorization;

  if (!expected || typeof provided !== "string") return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;

  try {
    return timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export default isAdminRequest;
