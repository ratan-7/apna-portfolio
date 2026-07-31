const express = require("express");
const router = express.Router();
const { createProject } = require("../controllers/projectController.js")

router.post("/projects", createProject);

module.exports = router;