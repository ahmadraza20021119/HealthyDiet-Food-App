const db = require('../config/db');

async function addNutritionColumns() {
    try {
        console.log("Adding nutrition columns to products table...");

        const [columns] = await db.query("SHOW COLUMNS FROM products");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('calories')) {
            await db.query("ALTER TABLE products ADD COLUMN calories INT DEFAULT 0");
            console.log("✅ Added 'calories' column.");
        } else {
            console.log("ℹ️ 'calories' column already exists.");
        }

        if (!columnNames.includes('protein')) {
            await db.query("ALTER TABLE products ADD COLUMN protein INT DEFAULT 0");
            console.log("✅ Added 'protein' column.");
        } else {
            console.log("ℹ️ 'protein' column already exists.");
        }

        if (!columnNames.includes('carbs')) {
            await db.query("ALTER TABLE products ADD COLUMN carbs INT DEFAULT 0");
            console.log("✅ Added 'carbs' column.");
        } else {
            console.log("ℹ️ 'carbs' column already exists.");
        }

        console.log("Database schema updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error updating database schema:", err);
        process.exit(1);
    }
}

addNutritionColumns();
