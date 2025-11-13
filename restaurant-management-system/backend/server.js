const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// WebSocket connection handling
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Broadcast updates to all connected clients
function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// ============= TABLE ROUTES =============

// Get all tables
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await db.all('SELECT * FROM tables ORDER BY table_number');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update table status
app.put('/api/tables/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { status, current_order_id } = req.body;

    await db.run(
      'UPDATE tables SET status = ?, current_order_id = ?, updated_at = CURRENT_TIMESTAMP WHERE table_number = ?',
      [status, current_order_id, tableNumber]
    );

    const updatedTable = await db.get('SELECT * FROM tables WHERE table_number = ?', [tableNumber]);

    broadcast({ type: 'table_update', data: updatedTable });
    res.json(updatedTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= MENU ROUTES =============

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM menu_items WHERE available = 1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    const items = await db.all(query, params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu categories
app.get('/api/menu/categories', (req, res) => {
  res.json([
    { id: 'pizza', name_en: 'Pizza', name_ar: 'بيتزا', name_ku: 'پیتزا' },
    { id: 'doner', name_en: 'Doner', name_ar: 'دونر', name_ku: 'دۆنەر' },
    { id: 'kurdish', name_en: 'Kurdish Food', name_ar: 'طعام كردي', name_ku: 'خواردنی کوردی' },
    { id: 'arabic', name_en: 'Arabic Food', name_ar: 'طعام عربي', name_ku: 'خواردنی عەرەبی' }
  ]);
});

// Add menu item (Admin)
app.post('/api/menu', async (req, res) => {
  try {
    const { name_en, name_ar, name_ku, description_en, description_ar, description_ku, price, category } = req.body;

    const result = await db.run(
      `INSERT INTO menu_items
      (name_en, name_ar, name_ku, description_en, description_ar, description_ku, price, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_ar, name_ku, description_en, description_ar, description_ku, price, category]
    );

    const newItem = await db.get('SELECT * FROM menu_items WHERE id = ?', [result.id]);
    broadcast({ type: 'menu_update', data: newItem });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item (Admin)
app.put('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_ar, name_ku, description_en, description_ar, description_ku, price, category, available } = req.body;

    await db.run(
      `UPDATE menu_items
      SET name_en = ?, name_ar = ?, name_ku = ?, description_en = ?, description_ar = ?,
          description_ku = ?, price = ?, category = ?, available = ?
      WHERE id = ?`,
      [name_en, name_ar, name_ku, description_en, description_ar, description_ku, price, category, available, id]
    );

    const updatedItem = await db.get('SELECT * FROM menu_items WHERE id = ?', [id]);
    broadcast({ type: 'menu_update', data: updatedItem });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item (Admin)
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM menu_items WHERE id = ?', [id]);
    broadcast({ type: 'menu_delete', data: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ORDER ROUTES =============

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('DATE(created_at) = DATE(?)');
      params.push(date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const orders = await db.all(query, params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { table_number, items, total_price, notes } = req.body;
    const orderId = uuidv4();

    // Insert order
    await db.run(
      `INSERT INTO orders (id, table_number, items, total_price, status, notes)
      VALUES (?, ?, ?, ?, 'pending', ?)`,
      [orderId, table_number, JSON.stringify(items), total_price, notes]
    );

    // Insert order items
    for (const item of items) {
      await db.run(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes)
        VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price, item.notes || '']
      );
    }

    // Update table status
    if (table_number) {
      await db.run(
        'UPDATE tables SET status = ?, current_order_id = ? WHERE table_number = ?',
        ['occupied', orderId, table_number]
      );
    }

    const newOrder = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);

    broadcast({ type: 'new_order', data: newOrder });
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_method } = req.body;

    let query = 'UPDATE orders SET status = ?';
    const params = [status];

    if (status === 'completed') {
      query += ', completed_at = CURRENT_TIMESTAMP';
      if (payment_method) {
        query += ', payment_method = ?';
        params.push(payment_method);
      }
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.run(query, params);

    // If order is completed, free up the table
    if (status === 'completed') {
      const order = await db.get('SELECT table_number FROM orders WHERE id = ?', [id]);
      if (order.table_number) {
        await db.run(
          'UPDATE tables SET status = ?, current_order_id = NULL WHERE table_number = ?',
          ['available', order.table_number]
        );
      }
    }

    const updatedOrder = await db.get('SELECT * FROM orders WHERE id = ?', [id]);

    broadcast({ type: 'order_update', data: updatedOrder });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Free up table if order had one
    const order = await db.get('SELECT table_number FROM orders WHERE id = ?', [id]);
    if (order && order.table_number) {
      await db.run(
        'UPDATE tables SET status = ?, current_order_id = NULL WHERE table_number = ?',
        ['available', order.table_number]
      );
    }

    await db.run('DELETE FROM order_items WHERE order_id = ?', [id]);
    await db.run('DELETE FROM orders WHERE id = ?', [id]);

    broadcast({ type: 'order_delete', data: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= REPORTS ROUTES =============

// Get daily sales report
app.get('/api/reports/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Get total revenue and orders
    const salesData = await db.get(
      `SELECT
        COUNT(*) as total_orders,
        SUM(total_price) as total_revenue,
        AVG(total_price) as average_order
      FROM orders
      WHERE DATE(created_at) = DATE(?)
      AND status = 'completed'`,
      [targetDate]
    );

    // Get payment methods breakdown
    const paymentMethods = await db.all(
      `SELECT payment_method, COUNT(*) as count, SUM(total_price) as total
      FROM orders
      WHERE DATE(created_at) = DATE(?)
      AND status = 'completed'
      AND payment_method IS NOT NULL
      GROUP BY payment_method`,
      [targetDate]
    );

    // Get popular items
    const popularItems = await db.all(
      `SELECT
        oi.menu_item_id,
        mi.name_en,
        mi.category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.price) as total_sales
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) = DATE(?)
      AND o.status = 'completed'
      GROUP BY oi.menu_item_id
      ORDER BY total_quantity DESC
      LIMIT 10`,
      [targetDate]
    );

    // Get sales by category
    const categoryBreakdown = await db.all(
      `SELECT
        mi.category,
        SUM(oi.quantity) as total_items,
        SUM(oi.quantity * oi.price) as total_sales
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) = DATE(?)
      AND o.status = 'completed'
      GROUP BY mi.category`,
      [targetDate]
    );

    // Get hourly breakdown
    const hourlyBreakdown = await db.all(
      `SELECT
        CAST(strftime('%H', created_at) AS INTEGER) as hour,
        COUNT(*) as orders,
        SUM(total_price) as revenue
      FROM orders
      WHERE DATE(created_at) = DATE(?)
      AND status = 'completed'
      GROUP BY hour
      ORDER BY hour`,
      [targetDate]
    );

    res.json({
      date: targetDate,
      summary: salesData,
      paymentMethods,
      popularItems,
      categoryBreakdown,
      hourlyBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get date range report
app.get('/api/reports/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const salesData = await db.get(
      `SELECT
        COUNT(*) as total_orders,
        SUM(total_price) as total_revenue,
        AVG(total_price) as average_order
      FROM orders
      WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
      AND status = 'completed'`,
      [start_date, end_date]
    );

    const dailyBreakdown = await db.all(
      `SELECT
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_price) as revenue
      FROM orders
      WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
      AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date`,
      [start_date, end_date]
    );

    res.json({
      start_date,
      end_date,
      summary: salesData,
      dailyBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Restaurant Management System Backend`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready`);
  console.log(`💾 Database: SQLite (local)\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  await db.close();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
