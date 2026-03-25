const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise'); // ✅ Use mysql2 with promise support
const path = require('path');
const app = express();

app.use(cookieParser());

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const productRoutes = require('./routes/products');
const db = require('./config/db');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/', productRoutes);

// Static assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Test DB connection
app.get('/test-db', async (req, res) => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL Connected from shared pool...');
    connection.release();
    res.send('Database connected');
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
    res.status(500).send('Database connection failed');
  }
});

const { authMiddleware, adminMiddleware } = require('./middleware/auth');

// Place order (Protected)
app.post('/order', authMiddleware, async (req, res) => {
  const { products, shippingAddress, paymentMethod, transactionId } = req.body;
  const user_id = req.user.id;

  if (!products || products.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Calculate total price accurately from database
    let totalPrice = 0;
    const orderItems = [];

    for (const item of products) {
      const [productRows] = await connection.query('SELECT price FROM products WHERE id = ?', [item.id]);
      if (productRows.length === 0) {
        throw new Error(`Product with ID ${item.id} not found`);
      }
      const price = productRows[0].price;
      const subtotal = price * item.quantity;
      totalPrice += subtotal;
      orderItems.push({
        product_id: item.id,
        quantity: item.quantity,
        subtotal: subtotal,
        instructions: item.instructions || ''
      });
    }

    // Insert Order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, status, shipping_address, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, totalPrice, 'paid', shippingAddress, paymentMethod, transactionId || `TXN-${Date.now()}`]
    );
    const orderId = orderResult.insertId;

    // Insert Order Items
    const orderItemQueries = orderItems.map(item =>
      connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, subtotal, instructions) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.subtotal, item.instructions]
      )
    );
    await Promise.all(orderItemQueries);

    await connection.commit();
    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId,
      transactionId: transactionId || `TXN-${Date.now()}`
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order: ' + err.message });
  } finally {
    connection.release();
  }
});

// Get user's own orders
app.get('/orders/me', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.total_price, o.status, o.created_at, o.delivery_partner, o.tracking_id,
             (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', p.name, 'image', p.image))
              FROM order_items oi
              JOIN products p ON oi.product_id = p.id
              WHERE oi.order_id = o.id) as items
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [user_id]);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Admin Endpoints ---
app.get('/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.total_price, o.status, o.created_at, o.delivery_partner, o.tracking_id, u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/admin/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  try {
    const validStatuses = ['pending', 'paid', 'processing', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/admin/orders/:id/assign', authMiddleware, adminMiddleware, async (req, res) => {
  const { delivery_partner } = req.body;
  const orderId = req.params.id;
  try {
    if (!['swiggy', 'zomato'].includes(delivery_partner)) {
      return res.status(400).json({ error: 'Invalid delivery partner' });
    }
    const tracking_id = `${delivery_partner.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const status = 'out_for_delivery';
    await db.query('UPDATE orders SET delivery_partner = ?, tracking_id = ?, status = ? WHERE id = ?', [delivery_partner, tracking_id, status, orderId]);
    res.json({ message: 'Delivery partner assigned', tracking_id, status, delivery_partner });
  } catch (err) {
    console.error('Error assigning partner:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, email, role
      FROM users
      ORDER BY id DESC
    `);
    res.json(users);
  } catch (err) {
    console.error('Error fetching admin users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
