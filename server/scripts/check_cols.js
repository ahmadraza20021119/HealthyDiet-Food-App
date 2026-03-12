const db = require('./config/db');
async function run() {
    try {
        const [rows] = await db.query('DESCRIBE users');
        console.log('COLUMNS:', rows.map(r => r.Field).join(', '));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
