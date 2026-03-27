const express = require('express');
const router = express.Router();
const db = require("../config/db");

// Get all products from DB (with optional filtering)
router.get('/products', async (req, res) => {
  const { goal, type } = req.query;
  try {
    let sql = `
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as rating, 
             COUNT(r.id) as reviews_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
    `;
    const conditions = [];
    const params = [];

    if (goal && goal !== 'maintenance') {
      conditions.push("p.health_goal = ?");
      params.push(goal);
    }
    
    if (type && type !== 'standard') {
      conditions.push("p.dietary_preference = ?");
      params.push(type);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " GROUP BY p.id";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get single product with reviews
router.get('/products/:id', async (req, res) => {
  try {
    const [productRows] = await db.query(`
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as rating, 
             COUNT(r.id) as reviews_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [req.params.id]);

    if (productRows.length === 0) return res.status(404).json({ error: "Product not found" });

    const [reviewRows] = await db.query(`
      SELECT id, user_name as user, rating, comment, user_id as userId, DATE_FORMAT(created_at, '%b %d, %Y') as date
      FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `, [req.params.id]);

    const product = {
      ...productRows[0],
      reviews: reviewRows
    };

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Review Endpoints ---

router.post('/products/:id/reviews', async (req, res) => {
  const { userId, user, rating, comment } = req.body;
  const productId = req.params.id;

  try {
    await db.query(
      "INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [productId, userId, user, rating, comment]
    );
    
    // Fetch updated product data to return (like MealDetail.js expects)
    const [productRows] = await db.query(`
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as rating, 
             COUNT(r.id) as reviews_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [productId]);

    const [reviewRows] = await db.query(`
      SELECT id, user_name as user, rating, comment, user_id as userId, DATE_FORMAT(created_at, '%b %d, %Y') as date
      FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `, [productId]);

    res.json({ ...productRows[0], reviews: reviewRows });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.put('/products/:id/reviews/:reviewId', async (req, res) => {
  const { rating, comment } = req.body;
  const { id: productId, reviewId } = req.params;

  try {
    await db.query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
      [rating, comment, reviewId]
    );

    // Fetch updated product data
    const [productRows] = await db.query(`
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as rating, 
             COUNT(r.id) as reviews_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [productId]);

    const [reviewRows] = await db.query(`
      SELECT id, user_name as user, rating, comment, user_id as userId, DATE_FORMAT(created_at, '%b %d, %Y') as date
      FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `, [productId]);

    res.json({ ...productRows[0], reviews: reviewRows });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.delete('/products/:id/reviews/:reviewId', async (req, res) => {
  const { id: productId, reviewId } = req.params;

  try {
    await db.query("DELETE FROM reviews WHERE id = ?", [reviewId]);

    // Fetch updated product data
    const [productRows] = await db.query(`
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as rating, 
             COUNT(r.id) as reviews_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [productId]);

    const [reviewRows] = await db.query(`
      SELECT id, user_name as user, rating, comment, user_id as userId, DATE_FORMAT(created_at, '%b %d, %Y') as date
      FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `, [productId]);

    res.json({ ...productRows[0], reviews: reviewRows });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new product
router.post('/products', async (req, res) => {
  const { name, description, price, image, health_goal, dietary_preference, calories, protein, carbs } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, image, health_goal, dietary_preference, calories, protein, carbs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, image, health_goal, dietary_preference, calories || 0, protein || 0, carbs || 0]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  const { name, description, price, image, health_goal, dietary_preference, calories, protein, carbs } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE products SET name=?, description=?, price=?, image=?, health_goal=?, dietary_preference=?, calories=?, protein=?, carbs=? WHERE id=?",
      [name, description, price, image, health_goal, dietary_preference, calories || 0, protein || 0, carbs || 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
