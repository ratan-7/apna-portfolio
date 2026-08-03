const express = require('express');
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

const app = express();
const port = 3000;

app.use(express.json());
connectDB();

app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", skillRoutes);
app.use("/api", experienceRoutes);
app.use("/api", educationRoutes);
app.use("/api", contactRoutes);
app.use("/api", certificateRoutes);
app.use("/api", socialLinksRoutes);
app.use("/api", analyticsRoutes);


app.get('/', (req, res) => {
    res.send('Portfolio api is running...');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});