const express = require("express")
const router = express.Router()

const { getLinks, updateLinks } = require("../controllers/socialLinksController")
const { verifyToken } = require("../middleware/verifyToken")

router.get("/socials", getLinks)
router.put("/socials",verifyToken, updateLinks)

module.exports = router