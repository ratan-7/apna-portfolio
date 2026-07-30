const express = require('express');
const connectDB = require("./config/db.js")
const authRoutes = require("./routes/authRoutes.js")


const app = express();
const port = 3000;

app.use(express.json());
connectDB();

app.use("/api", authRoutes);

app.get('/', (req, res) => {
    res.send('Portfolio api is running...');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});