const Project = require("../models/Project.js")

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