const express = require('express');
const connectDB = require("./config/db.js")

const app = express();
const port = 3000;

app.use(express.json());
connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});