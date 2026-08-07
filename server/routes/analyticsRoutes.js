const express = require("express");
const router = express.Router();
const {
    getAnalytics,
    getPublicStats,
    incrementVisitor,
    incrementResumeDownload,
} = require("../controllers/analyticsController.js");
const { verifyToken } = require("../middleware/verifyToken.js");

// Admin only — dashboard stats
router.get("/", verifyToken, getAnalytics);

// Public
router.get("/public", getPublicStats);
router.post("/visit", incrementVisitor);
router.post("/resume-download", incrementResumeDownload);

module.exports = router;