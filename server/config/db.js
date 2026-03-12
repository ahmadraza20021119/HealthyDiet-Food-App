require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "diet_food_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Connected to MySQL Database!");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL connection error: " + err.message);
    }
})();

module.exports = db;
