const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    try {
        const res = await axios.get(url);
        const names = res.data.models.map(m => m.name.replace('models/', ''));
        console.log("FOUND_MODELS:" + JSON.stringify(names));
    } catch (err) {
        console.log("❌ Error:", err.response ? err.response.status : err.message);
    }
}
listModels();
