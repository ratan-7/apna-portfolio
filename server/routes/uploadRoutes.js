const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.js");
const { uploadFile } = require("../controllers/uploadController.js");
const { verifyToken } = require("../middleware/verifyToken.js");

router.post("/", verifyToken, upload.single("file"), uploadFile);

module.exports = router;