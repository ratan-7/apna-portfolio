const Project = require("../models/Project.js")

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        if (projects.length == 0) {
            return res.status(200).json({
                message: "project not found"
            })
        }
        res.status(200).json({
            projects: projects
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.createProject = async (req, res) => {
    try {
        const { title, description, skills, image, url } = req.body;
        const skillsArray = skills
            .split(",")
            .map(skill => skill.trim());

        const project = new Project({
            title,
            description,
            skills: skillsArray,
            image,
            url
        });
        await project.save();
        res.status(200).json({
            message: "project created successfully!", project: project
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Project Deleted successfully!!", project: project
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateProject = async (req, res) => {
    try {
        const { title, description, skills, url } = req.body;

        const updateData = {
            title,
            description,
            url
        };
        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({
            message: "Project update successfully!!", Project: project
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}