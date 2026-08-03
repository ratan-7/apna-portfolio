const express = require("express")
const router = express.Router()

const { increaseVisitor, increaseResumeDownload, getAnalytics } = require("../controllers/analyticsController")
const { verifyToken } = require("../middleware/verifyToken")

router.post("/visit", increaseVisitor);

router.post(
    "/resume-download",
    increaseResumeDownload
);

router.get(
    "/",
    verifyToken,
    getAnalytics
);

module.exports = router;