const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    try {
        const res = await axios.get(url);
        console.log("✅ Models found:", res.data.models.map(m => m.name));
    } catch (err) {
        console.log("❌ Error:", err.response ? err.response.status : err.message);
        if (err.response) console.log(err.response.data);
    }
}
listModels();
