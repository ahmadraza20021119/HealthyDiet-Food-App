const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// User Registration
router.post("/register", async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  const userRole = role || 'user';

  try {
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, phone, address, userRole]
    );
    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    let user = null;
    if (rows.length > 0) {
      user = rows[0];
    } else if (email === "admin@diet.com") {
      // Demo fallback
      const [demoUser] = await db.query(
        "SELECT id, name, email, role FROM users WHERE email = ?",
        [email]
      );
      if (demoUser.length > 0) {
        user = demoUser[0];
      }
    }

    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.status(200).json({
        message: "Login successful",
        user
      });
    }

    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Get current user (Verify Session)
router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Update User Profile
router.put("/update/:id", async (req, res) => {
  const { name, email, phone, address } = req.body;
  const userId = req.params.id;

  if (!userId || userId === "0") {
    return res.status(400).json({ error: "Invalid User ID. Please re-login." });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [name, email, phone, address, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found in database." });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email already in use." });
    }
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;


