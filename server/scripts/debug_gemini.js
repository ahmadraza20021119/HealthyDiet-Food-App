const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    console.log("Testing Gemini with Key:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    for (const modelName of models) {
        console.log(`\nTrying model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`✅ Success with ${modelName}:`, response.text().substring(0, 50));
            return;
        } catch (err) {
            console.error(`❌ Failed with ${modelName}:`, err.message);
            if (err.response) console.log("Response status:", err.response.status);
        }
    }
}

testGemini();
