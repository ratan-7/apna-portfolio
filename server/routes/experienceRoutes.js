const express = require("express")
const router = express.Router();

const { addExperience, removeExperience, updateExperience, getAllExperiences } = require("../controllers/experienceController.js")

router.get("/experiences", getAllExperiences)
router.post("/experiences", addExperience)
router.delete("/experiences/:id", removeExperience)
router.patch("/experiences/:id", updateExperience)

module.exports = router;