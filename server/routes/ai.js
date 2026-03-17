const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// ─── In-Memory Response Cache ─────────────────────────────────────────────────
// Caches AI responses to avoid burning RPD quota on repeated/similar questions
const responseCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCacheKey(message, userProfile) {
    // Normalize the message to catch near-duplicates
    const normalizedMsg = message.toLowerCase().trim().replace(/\s+/g, ' ');
    const profileKey = userProfile ? `${userProfile.goal || ''}-${userProfile.weight || ''}` : '';
    return `${normalizedMsg}::${profileKey}`;
}

function getCachedResponse(key) {
    const entry = responseCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        responseCache.delete(key);
        return null;
    }
    return entry.reply;
}

function setCachedResponse(key, reply) {
    // Limit cache size to 100 entries to prevent memory issues
    if (responseCache.size >= 100) {
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
    }
    responseCache.set(key, { reply, timestamp: Date.now() });
}

// ─── Rate Limit Tracker ───────────────────────────────────────────────────────
// Tracks requests per day per model to avoid hitting RPD limits
const rateLimitTracker = new Map();
const FREE_TIER_RPD = 20; // Free tier RPD limit

function getRateLimitKey(modelName) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${modelName}::${today}`;
}

function isModelAvailable(modelName) {
    const key = getRateLimitKey(modelName);
    const count = rateLimitTracker.get(key) || 0;
    return count < FREE_TIER_RPD - 2; // Leave a 2-request buffer
}

function trackModelUsage(modelName) {
    const key = getRateLimitKey(modelName);
    const count = rateLimitTracker.get(key) || 0;
    rateLimitTracker.set(key, count + 1);

    // Clean up old date entries
    for (const [k] of rateLimitTracker) {
        if (!k.includes(new Date().toISOString().split('T')[0])) {
            rateLimitTracker.delete(k);
        }
    }
}

function markModelRateLimited(modelName) {
    const key = getRateLimitKey(modelName);
    rateLimitTracker.set(key, FREE_TIER_RPD); // Mark as exhausted
}

// ─── Delay helper for retry backoff ──────────────────────────────────────────
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Status endpoint ─────────────────────────────────────────────────────────
// Lets the frontend check API health & remaining quota
router.get('/status', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const hasKey = !!(apiKey && !apiKey.includes('your_'));

    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];

    const modelStatus = modelsToTry.map(model => ({
        name: model,
        available: isModelAvailable(model),
        usedToday: rateLimitTracker.get(getRateLimitKey(model)) || 0,
        limit: FREE_TIER_RPD
    }));

    res.json({
        hasApiKey: hasKey,
        cacheSize: responseCache.size,
        models: modelStatus
    });
});

// ─── Main AI Recommend Endpoint ──────────────────────────────────────────────
router.post('/recommend', async (req, res) => {
    const { message, userProfile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_')) {
        return res.json({
            reply: `[Demo Mode] As your AI Coach: Great question! For personalized advice, please add a valid Gemini API key to enable real AI responses.`,
            cached: false
        });
    }

    // ── Check cache first ─────────────────────────────────────────────────
    const cacheKey = getCacheKey(message, userProfile);
    const cachedReply = getCachedResponse(cacheKey);
    if (cachedReply) {
        console.log(`📦 Cache hit for: "${message.substring(0, 40)}..."`);
        return res.json({ reply: cachedReply, cached: true });
    }

    // ── Model priority: prefer models with remaining quota ────────────────
    const allModels = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];

    // Sort: available models first, then exhausted ones as fallback
    const modelsToTry = [
        ...allModels.filter(m => isModelAvailable(m)),
        ...allModels.filter(m => !isModelAvailable(m))
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
    const MAX_RETRIES = 2;

    for (const modelName of modelsToTry) {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (attempt > 0) {
                    console.log(`🔄 Retry #${attempt} for ${modelName}...`);
                }
                console.log(`Attempting Gemini with model: ${modelName} (attempt ${attempt + 1})`);
                
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    systemInstruction: systemInstruction
                });
                const result = await model.generateContent(userMessage);
                const response = await result.response;
                const text = response.text();

                // Track usage & cache the response
                trackModelUsage(modelName);
                setCachedResponse(cacheKey, text);

                console.log(`✅ Success with ${modelName}`);
                return res.json({ reply: text, cached: false, model: modelName });

            } catch (err) {
                const errMsg = err.message || '';
                console.warn(`⚠️ Model ${modelName} attempt ${attempt + 1} failed: ${errMsg}`);

                // If rate limited (429), mark model and skip retries
                if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('quota')) {
                    console.warn(`🚫 ${modelName} rate limited — marking as exhausted for today`);
                    markModelRateLimited(modelName);
                    break; // Skip retries, move to next model
                }

                // If 404 (model not found), skip retries
                if (errMsg.includes('404') || errMsg.toLowerCase().includes('not found')) {
                    console.warn(`❌ ${modelName} not available — skipping`);
                    break;
                }

                // Exponential backoff for transient errors
                if (attempt < MAX_RETRIES) {
                    const backoffMs = Math.pow(2, attempt) * 1000; // 1s, 2s
                    console.log(`⏳ Waiting ${backoffMs}ms before retry...`);
                    await delay(backoffMs);
                }
            }
        }
    }

    // All models failed
    console.error("❌ All Gemini models failed.");
    res.status(503).json({ 
        error: "AI service temporarily unavailable",
        message: "All AI models have reached their daily limit. The limits reset at midnight Pacific Time (~12:30 PM IST). Please try again later!",
        retryAfter: getTimeUntilReset()
    });
});

// ─── Helper: estimate time until daily reset ─────────────────────────────────
function getTimeUntilReset() {
    const now = new Date();
    // Reset happens at midnight Pacific Time (UTC-7 during PDT)
    const resetHourUTC = 7; // midnight PDT = 7:00 AM UTC
    const resetTime = new Date(now);
    resetTime.setUTCHours(resetHourUTC, 0, 0, 0);
    if (now >= resetTime) {
        resetTime.setUTCDate(resetTime.getUTCDate() + 1);
    }
    const diffMs = resetTime - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

// ─── Clear cache endpoint (for admin/debug) ──────────────────────────────────
router.delete('/cache', (req, res) => {
    const size = responseCache.size;
    responseCache.clear();
    res.json({ message: `Cleared ${size} cached responses` });
});

module.exports = router;
