const express = require("express")
const router = express.Router()

const { addEducation, removeEducation, updateEducation, getAllEducation } = require("../controllers/educationController.js")

router.get("/educations", getAllEducation);
router.post("/educations", addEducation);
router.delete("/educations/:id", removeEducation);
router.patch("/educations/:id", updateEducation);


module.exports = router;