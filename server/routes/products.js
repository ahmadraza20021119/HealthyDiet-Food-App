const express = require('express');
const router = express.Router();
const db = require("../config/db");

// Get all products from DB (with optional filtering)
router.get('/products', async (req, res) => {
  const { goal, type } = req.query;
  try {
    let sql = "SELECT * FROM products";
    const params = [];

    if (goal || type) {
      sql += " WHERE";
      if (goal) {
        sql += " health_goal = ?";
        params.push(goal);
      }
      if (type) {
        if (goal) sql += " AND";
        sql += " dietary_preference = ?";
        params.push(type);
      }
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
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
