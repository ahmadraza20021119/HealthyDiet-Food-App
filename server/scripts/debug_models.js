const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // This is a bit of a hack to see available models if listModels isn't directly exposed or working
        console.log("Checking model: gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Response:", (await result.response).text());
    } catch (err) {
        console.log("Error details:", err);
    }
}
listModels();
