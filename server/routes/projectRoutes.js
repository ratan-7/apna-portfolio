const express = require("express");
const router = express.Router();
const { createProject, deleteProject, updateProject, getAllProjects } = require("../controllers/projectController.js")
const { verifyToken } = require("../middleware/verifyToken")

router.get("/projects", getAllProjects)
router.post("/projects",verifyToken,  createProject);
router.delete("/projects/:id",verifyToken,  deleteProject);
router.patch("/projects/:id",verifyToken,  updateProject);

module.exports = router;