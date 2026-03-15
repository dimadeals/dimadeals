import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'orderId parameter is required'
        });
      }

      // Try to retrieve from database if available
      let orderData = null;

      if (process.env.REDIS_URL) {
        try {
          const order = await kv.get(`order:${orderId}`);
          if (order) {
            orderData = JSON.parse(order);
          }
        } catch (kvError) {
          console.error('⚠️ Database error:', kvError.message);
        }
      }

      if (!orderData) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          orderId
        });
      }

      return res.status(200).json({
        success: true,
        order: orderData
      });

    } catch (error) {
      console.error('❌ Error retrieving confirmation:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve order confirmation'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'orderId is required'
        });
      }

      // Retrieve and return confirmation
      if (process.env.REDIS_URL) {
        try {
          const order = await kv.get(`order:${orderId}`);
          if (!order) {
            return res.status(404).json({
              success: false,
              error: 'Order not found'
            });
          }

          const orderData = JSON.parse(order);

          // Update order status to 'confirmed'
          orderData.status = 'confirmed';
          orderData.confirmedAt = new Date().toISOString();
          
          await kv.set(
            `order:${orderId}`,
            JSON.stringify(orderData),
            { ex: 7776000 }
          );

          return res.status(200).json({
            success: true,
            message: 'Order confirmed',
            order: orderData
          });
        } catch (kvError) {
          console.error('⚠️ Database error:', kvError.message);
          return res.status(500).json({
            success: false,
            error: 'Database error'
          });
        }
      } else {
        return res.status(503).json({
          success: false,
          error: 'Database not available'
        });
      }

    } catch (error) {
      console.error('❌ Error confirming order:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to confirm order'
      });
    }
  }

  return res.status(405).json({
    error: 'Method not allowed'
  });
}
