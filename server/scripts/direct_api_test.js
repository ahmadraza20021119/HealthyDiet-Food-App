const axios = require('axios');
require('dotenv').config();

async function directTest() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    try {
        const res = await axios.post(url, {
            contents: [{ parts: [{ text: "Hello" }] }]
        });
        console.log("✅ Direct API Success:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log("❌ Direct API Error:", err.response ? err.response.status : err.message);
        if (err.response) {
            console.log("Error Body:", JSON.stringify(err.response.data, null, 2));
        }
    }
}
directTest();
