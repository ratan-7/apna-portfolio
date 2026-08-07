const Experience = require("../models/Experience.js")

exports.getAllExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find();
        if (experiences.length == 0) {
            return res.status(200).json({
                message: "experiences not found"
            })
        }
        res.status(200).json(
            experiences
        )
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.addExperience = async (req, res) => {
    try {
        const { title, company, location, startDate, endDate, currentlyWorking, description, skills } = req.body;
        const experience = new Experience({
            title,
            company,
            location,
            startDate,
            endDate,
            currentlyWorking,
            description,
            skills
        })
        await experience.save();
        res.status(200).json({
            message: "Experience added successfully!", experience
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.removeExperience = async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "Experience removed successfully!", experience
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateExperience = async (req, res) => {
    try {
        const { title, company, location, startDate, endDate, currentlyWorking, description, skills } = req.body;
        const updateData = ({
            title,
            company,
            location,
            startDate,
            endDate,
            currentlyWorking,
            description,
            skills
        })
        const experience = await Experience.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.status(200).json({
            message: "Experience updated successfully!", experience
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}