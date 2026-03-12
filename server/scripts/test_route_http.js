const axios = require('axios');

async function testRoute() {
    console.log("Testing POST /api/ai/recommend...");
    try {
        const res = await axios.post('http://localhost:5000/api/ai/recommend', {
            message: "Hello world",
            userProfile: { healthGoal: "muscleGain" }
        });
        console.log("✅ Server Success:", res.data);
    } catch (err) {
        if (err.response) {
            console.error("❌ Server Error:", err.response.status, err.response.data);
        } else {
            console.error("❌ Error:", err.message);
        }
    }
}

testRoute();
