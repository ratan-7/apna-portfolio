const express = require("express");
const router = express.Router();
const { createProject, deleteProject, updateProject, getAllProjects } = require("../controllers/projectController.js")

router.get("/projects", getAllProjects)
router.post("/projects", createProject);
router.delete("/projects/:id", deleteProject);
router.patch("/projects/:id", updateProject);

module.exports = router;