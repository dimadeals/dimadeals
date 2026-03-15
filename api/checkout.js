import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { items, email, phone, fullname, country, total } = req.body;

      // Validation
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Cart is empty. Please add items before checkout.'
        });
      }

      if (!email || !phone || !fullname) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required (email, phone, name)'
        });
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      // Validate phone (Tunisian: 8 digits)
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 8) {
        return res.status(400).json({
          success: false,
          error: 'Phone must be 8 digits'
        });
      }

      if (!fullname || fullname.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Full name must be at least 3 characters'
        });
      }

      // Generate Order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create comprehensive order record
      const orderRecord = {
        orderId,
        email: email.toLowerCase(),
        phone: cleanPhone,
        fullname: fullname.trim(),
        country: country || 'TN',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        })),
        subtotal: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
        tax: 0,
        total: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
        status: 'completed',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      };

      console.log(`📦 Processing checkout for Order: ${orderId}`);
      console.log(`👤 Customer: ${email}`);
      console.log(`📊 Items: ${items.length}, Total: ${orderRecord.total} TND`);

      // Save to Vercel KV if available
      let savedToDatabase = false;
      if (process.env.REDIS_URL) {
        try {
          // Save main order record
          await kv.set(
            `order:${orderId}`,
            JSON.stringify(orderRecord),
            { ex: 7776000 } // 90 days
          );

          // Save customer record
          await kv.set(
            `customer:${email}`,
            JSON.stringify({
              email,
              phone: cleanPhone,
              fullname,
              country,
              lastOrder: orderId,
              lastOrderDate: orderRecord.createdAt,
              totalOrders: 1
            }),
            { ex: 31536000 } // 1 year
          );

          // Add to customer's order list
          const customerOrders = await kv.get(`customer:${email}:orders`) || '[]';
          const orders = JSON.parse(customerOrders);
          orders.push(orderId);
          await kv.set(
            `customer:${email}:orders`,
            JSON.stringify(orders),
            { ex: 31536000 }
          );

          savedToDatabase = true;
          console.log(`✅ Order saved to database: ${orderId}`);
        } catch (kvError) {
          console.error('⚠️ Database error:', kvError.message);
          // Continue - database is not critical
        }
      }

      // Return comprehensive success response
      return res.status(200).json({
        success: true,
        message: 'Order placed successfully',
        orderId,
        email,
        savedToDatabase,
        nextStep: 'confirmation',
        orderData: {
          orderId,
          items: orderRecord.items,
          total: orderRecord.total,
          email,
          fullname,
          createdAt: orderRecord.createdAt
        }
      });

    } catch (error) {
      console.error('❌ Checkout error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process checkout',
        message: error.message
      });
    }
  }

  if (req.method === 'GET') {
    // Optional: retrieve order by ID
    try {
      const { orderId } = req.query;
      
      if (!orderId) {
        return res.status(400).json({
          error: 'orderId query parameter is required'
        });
      }

      if (process.env.REDIS_URL) {
        const order = await kv.get(`order:${orderId}`);
        if (!order) {
          return res.status(404).json({
            error: 'Order not found'
          });
        }
        return res.status(200).json(JSON.parse(order));
      } else {
        return res.status(503).json({
          error: 'Database not available'
        });
      }
    } catch (error) {
      console.error('❌ Error retrieving order:', error);
      return res.status(500).json({
        error: 'Failed to retrieve order'
      });
    }
  }

  return res.status(405).json({
    error: 'Method not allowed'
  });
}
