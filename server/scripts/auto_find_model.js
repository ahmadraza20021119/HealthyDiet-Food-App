const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function findAndTest() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    try {
        const res = await axios.get(url);
        const geminiModels = res.data.models
            .map(m => m.name.replace('models/', ''))
            .filter(m => m.startsWith('gemini-') && !m.includes('vision') && !m.includes('embedding'));

        console.log("Gemini models available:", geminiModels);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        for (const m of geminiModels) {
            console.log(`Testing ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("hello");
                console.log(`✅ Success with ${m}:`, (await result.response).text().substring(0, 20));
                return m;
            } catch (e) {
                console.log(`❌ ${m} failed:`, e.message);
            }
        }
    } catch (err) {
        console.log("Error:", err.message);
    }
}
findAndTest();
