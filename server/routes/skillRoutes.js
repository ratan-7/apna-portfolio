const express = require("express");
const router = express.Router();

const { addSkill, deleteSkill, updateSkill, getAllSkills } = require("../controllers/skillController.js")

router.get("/skills", getAllSkills);
router.post("/skills", addSkill);
router.delete("/skills/:id", deleteSkill);
router.patch("/skills/:id", updateSkill);

module.exports = router;