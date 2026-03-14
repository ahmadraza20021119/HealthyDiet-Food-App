const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection pool

router.post("/userinfo", async (req, res) => {
  try {
    const {
      name, age, gender, weight, height,
      activityLevel, healthGoal, dietaryPreference,
      allergies, foodIntake
    } = req.body;

    console.log("Incoming user info:", req.body); // ✅ Log to debug

    // For demo, just store in localStorage or something, but since server, just respond
    // Comment out DB insert to prevent crash
    const [result] = await db.query(
      `INSERT INTO user_info 
        (name, age, gender, weight, height, activity_level, health_goal, dietary_preference, allergies, food_intake)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, age, gender, weight, height,
        activityLevel, healthGoal, dietaryPreference,
        allergies, foodIntake
      ]
    );

    res.json({ message: 'User info saved successfully', insertId: 1 });
  } catch (error) {
    console.error('❌ Error inserting user info:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
