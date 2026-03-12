const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

router.post('/recommend', async (req, res) => {
    const { message, userProfile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_')) {
        return res.json({
            reply: `[Demo Mode] As a Smart Diet AI. (Please add a valid Gemini API key).`
        });
    }

    const prompt = `You are a high-performance Personal Trainer. 
    User Question: "${message}"
    User Profile: ${JSON.stringify(userProfile)}
    
    STRICT RESPONSE RULES:
    1. Be concise. Max 3-5 sentences or short bullets.
    2. NO conversational filler (e.g., "Alright Ahmed", "I'm thrilled to help"). Get straight to the point.
    3. Use clear formatting (bullets or numbered lists) for recommendations.
    4. Provide specific, actionable advice.
    5. Formatting: Use Markdown (bolding for titles, lists for steps).`;

    // Modern list of models to try in order of preference
    const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting Gemini with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log(`✅ Success with ${modelName}`);
            return res.json({ reply: text });
        } catch (err) {
            console.warn(`⚠️ Model ${modelName} failed: ${err.message}`);
        }
    }

    console.error("❌ All Gemini models failed.");
    res.status(500).json({ error: "No working Gemini model found for this API key." });
});

module.exports = router;
