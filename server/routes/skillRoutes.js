const express = require("express");
const router = express.Router();

const { addSkill, deleteSkill, updateSkill, getAllSkills } = require("../controllers/skillController.js")
const { verifyToken } = require("../middleware/verifyToken")

router.get("/skills", getAllSkills);
router.post("/skills",verifyToken,  addSkill);
router.delete("/skills/:id",verifyToken,  deleteSkill);
router.patch("/skills/:id",verifyToken, updateSkill);

module.exports = router;