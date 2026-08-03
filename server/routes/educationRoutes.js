const express = require("express")
const router = express.Router()

const { addEducation, removeEducation, updateEducation, getAllEducation } = require("../controllers/educationController.js")

const { verifyToken } = require("../middleware/verifyToken")


router.get("/educations", getAllEducation);
router.post("/educations",verifyToken,  addEducation);
router.delete("/educations/:id", verifyToken, removeEducation);
router.patch("/educations/:id",verifyToken,  updateEducation);


module.exports = router;