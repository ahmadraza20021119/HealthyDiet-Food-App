const db = require('../config/db');
async function run() {
    try {
        const [rows] = await db.query('SHOW COLUMNS FROM users');
        console.log('Columns in users table:');
        rows.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
run();
