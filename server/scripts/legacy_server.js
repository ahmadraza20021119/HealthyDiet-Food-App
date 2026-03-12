const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to the Diet Food Delivery API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
app.use(express.json()); // Needed to parse JSON body

app.post("/api/userinfo", (req, res) => {
    const userData = req.body;
    console.log("User Info Received:", userData);
    // Save to DB or handle logic here
    res.status(200).json({ message: "User info saved successfully" });
});
