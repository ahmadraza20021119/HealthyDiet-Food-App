const db = require('../config/db');
async function run() {
    try {
        await db.query("INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@diet.com', 'admin123', 'admin')");
        console.log('Admin inserted');
    } catch (e) {
        console.log('Admin already exists or error:', e.message);
    }
    process.exit(0);
}
run();
