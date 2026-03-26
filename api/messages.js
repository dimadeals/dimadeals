// ============ MESSAGES API ============
// Handles contact form submissions

const { getRedis } = require('./redis.js');

const ADMIN_KEY = process.env.ADMIN_KEY || 'your-secret-admin-key-here';
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || 'http://localhost:3000';
const MESSAGES_KEY = 'contact:messages';

// Validate admin authorization
function validateAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || auth !== ADMIN_KEY) {
    return false;
  }
  return true;
}

// POST: Save contact message
async function handlePostMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Create message object
    const messageData = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread' // unread, read
    };

    // Save to Redis
    try {
      const redis = await getRedis();
      const messages = await redis.get(MESSAGES_KEY);
      const allMessages = messages ? JSON.parse(messages) : [];
      allMessages.push(messageData);
      await redis.set(MESSAGES_KEY, JSON.stringify(allMessages));
    } catch (storageError) {
      console.error('Failed to save message:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to save message'
      });
    }

    res.json({
      success: true,
      message: 'Message received! We will contact you soon.',
      data: messageData
    });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// GET: Retrieve all messages (admin only)
async function handleGetMessages(req, res) {
  try {
    // Validate admin access
    if (!validateAdmin(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Fetch messages from Redis
    try {
      const redis = await getRedis();
      const messages = await redis.get(MESSAGES_KEY);
      const allMessages = messages ? JSON.parse(messages) : [];

      // Sort by date descending
      allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        success: true,
        total: allMessages.length,
        messages: allMessages
      });
    } catch (storageError) {
      console.error('Failed to fetch messages:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  } catch (error) {
    console.error('GET /api/messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// DELETE: Delete a message (admin only)
async function handleDeleteMessage(req, res) {
  try {
    // Validate admin access
    if (!validateAdmin(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Message ID is required'
      });
    }

    try {
      const redis = await getRedis();
      const messages = await redis.get(MESSAGES_KEY);
      const allMessages = messages ? JSON.parse(messages) : [];
      const filtered = allMessages.filter(m => m.id !== parseInt(id));

      if (filtered.length === allMessages.length) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      await redis.set(MESSAGES_KEY, JSON.stringify(filtered));
      res.json({
        success: true,
        message: 'Message deleted'
      });
    } catch (storageError) {
      console.error('Failed to delete message:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete message'
      });
    }
  } catch (error) {
    console.error('DELETE /api/messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

module.exports = {
  handlePostMessage,
  handleGetMessages,
  handleDeleteMessage
};
