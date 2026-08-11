const express = require('express');
const cors = require("cors")
const connectDB = require("./config/db.js")
const authRoutes = require("./routes/authRoutes.js")
const projectRoutes = require("./routes/projectRoutes.js")
const skillRoutes = require("./routes/skillRoutes.js")
const experienceRoutes = require("./routes/experienceRoutes.js")
const educationRoutes = require("./routes/educationRoutes.js")
const contactRoutes = require("./routes/contactRoutes.js")
const certificateRoutes = require("./routes/certificateRoutes.js")
const socialLinksRoutes = require("./routes/socialLinksRoutes.js")
const analyticsRoutes = require("./routes/analyticsRoutes.js")
const profileRoutes = require("./routes/profileRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");

const app = express();
const port = 3000;
app.use(
    cors({
        origin: [
            "https://ratan-portfolio-beta.vercel.app",
            "http://localhost:5173"
        ],
        credentials: true,
    })
);
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", skillRoutes);
app.use("/api", experienceRoutes);
app.use("/api", educationRoutes);
app.use("/api", contactRoutes);
app.use("/api", certificateRoutes);
app.use("/api", socialLinksRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", profileRoutes);
app.use("/api/upload", uploadRoutes);

app.get('/', (req, res) => {
    res.send('Portfolio api is running...');
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is awake"
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});