const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController.js");
const { verifyToken } = require("../middleware/verifyToken.js");

router.get("/profile", getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
