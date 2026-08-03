const express = require("express")
const router = express.Router();

const { addExperience, removeExperience, updateExperience, getAllExperiences } = require("../controllers/experienceController.js")
const { verifyToken } = require("../middleware/verifyToken")

router.get("/experiences", getAllExperiences)
router.post("/experiences",verifyToken,  addExperience)
router.delete("/experiences/:id",verifyToken,  removeExperience)
router.patch("/experiences/:id",verifyToken,  updateExperience)

module.exports = router;