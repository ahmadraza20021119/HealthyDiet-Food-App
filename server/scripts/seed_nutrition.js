const db = require('../config/db');

const nutritionData = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 12 },
    { name: 'Quinoa Veggie Bowl', calories: 420, protein: 14, carbs: 65 },
    { name: 'Avocado Toast & Eggs', calories: 480, protein: 18, carbs: 45 },
    { name: 'Berry Protein Smoothie', calories: 280, protein: 25, carbs: 32 },
    { name: 'Tofu Stir Fry', calories: 310, protein: 22, carbs: 18 },
    { name: 'Keto Beef Stir Fry', calories: 550, protein: 42, carbs: 8 }
];

async function seedNutrition() {
    try {
        for (const data of nutritionData) {
            await db.query(
                "UPDATE products SET calories = ?, protein = ?, carbs = ? WHERE name = ?",
                [data.calories, data.protein, data.carbs, data.name]
            );
            console.log(`✅ Updated nutrition for: ${data.name}`);
        }

        // Also update any others to random values if they are 0
        const [remaining] = await db.query("SELECT id, name FROM products WHERE calories = 0");
        for (const product of remaining) {
            const calories = Math.floor(Math.random() * 400) + 200;
            const protein = Math.floor(Math.random() * 30) + 10;
            const carbs = Math.floor(Math.random() * 50) + 10;
            await db.query(
                "UPDATE products SET calories = ?, protein = ?, carbs = ? WHERE id = ?",
                [calories, protein, carbs, product.id]
            );
            console.log(`✅ Updated random nutrition for: ${product.name}`);
        }

        console.log("Nutrition seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding nutrition:", err);
        process.exit(1);
    }
}

seedNutrition();
