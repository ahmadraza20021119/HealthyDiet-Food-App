const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Updating database schema...');

        // Check if columns exist before adding them (safety)
        const [columns] = await connection.query('SHOW COLUMNS FROM orders');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('status')) {
            await connection.query("ALTER TABLE orders ADD COLUMN status ENUM('pending', 'paid', 'processing', 'delivered', 'cancelled') DEFAULT 'pending'");
        } else {
            // Modify it just in case the ENUM values are wrong
            await connection.query("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'paid', 'processing', 'delivered', 'cancelled') DEFAULT 'pending'");
        }
        if (!columnNames.includes('shipping_address')) {
            await connection.query("ALTER TABLE orders ADD COLUMN shipping_address TEXT");
        }
        if (!columnNames.includes('payment_method')) {
            await connection.query("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50)");
        }
        if (!columnNames.includes('transaction_id')) {
            await connection.query("ALTER TABLE orders ADD COLUMN transaction_id VARCHAR(255)");
        }
        if (!columnNames.includes('created_at')) {
            await connection.query("ALTER TABLE orders ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        }

        // Add instructions to order_items if not exists
        const [itemColumns] = await connection.query('SHOW COLUMNS FROM order_items');
        const itemColumnNames = itemColumns.map(c => c.Field);
        if (!itemColumnNames.includes('instructions')) {
            await connection.query("ALTER TABLE order_items ADD COLUMN instructions TEXT");
        }

        console.log('✅ Database schema updated successfully');
    } catch (err) {
        console.error('❌ Error updating database:', err);
    } finally {
        await connection.end();
    }
}

updateDb();
