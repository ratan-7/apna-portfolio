const express = require("express");
const router = express.Router();
const { getSocialLinks, updateSocialLinks } = require("../controllers/socialLinksController.js");
const { verifyToken } = require("../middleware/verifyToken.js");

router.get("/social", getSocialLinks);
router.put("/social", verifyToken, updateSocialLinks);

module.exports = router;
