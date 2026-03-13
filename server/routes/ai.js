const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

router.post('/recommend', async (req, res) => {
    const { message, userProfile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_')) {
        return res.json({
            reply: `[Demo Mode v2] As your AI Coach. (Please add a valid Gemini API key).`
        });
    }

    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];

    const systemInstruction = `You are a world-class AI Fitness & Nutrition Coach. 
    You have DUAL expertise as a Master Personal Trainer and Clinical Nutritionist.
    MANDATORY: If asked for a workout, provide a full professional routine. NEVER redirect to nutrition.`;

    const instructions = `
    INSTRUCTIONS:
    1. You are a DUAL EXPERT (Trainer + Nutritionist).
    2. If the user asks for a workout (e.g. "chest workout"), provide a professional routine (Exercises, Sets, Reps, Tips).
    3. DO NOT redirect a fitness query to nutrition.
    4. Provide recipes ONLY for food queries.
    5. Be authoritative and motivating.
    `;

    const userMessage = `${instructions}\n\nUser Profile: ${JSON.stringify(userProfile)}\n\nUser Question: "${message}"`;

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting Gemini with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                systemInstruction: systemInstruction
            });
            const result = await model.generateContent(userMessage);
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
