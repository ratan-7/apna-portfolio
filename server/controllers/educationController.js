const Education = require("../models/Education.js")

exports.getAllEducation = async (req, res) => {
    try {
        const educations = await Education.find();
        if (educations.length == 0) {
            return res.status(200).json({
                message: "education not found"
            })
        }
        res.status(200).json(educations)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.addEducation = async (req, res) => {
    try {
        const { school, degree, field, startDate, endDate, currentlyWorking, grade, description, skills } = req.body;
        const education = new Education({
            school,
            degree,
            field,
            startDate,
            endDate,
            currentlyWorking,
            grade,
            description,
            skills
        })
        await education.save();
        res.status(200).json({
            message: "Education added successfully!", education
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.removeEducation = async (req, res) => {
    try {
        const education = await Education.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Education removed successfully!", education
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateEducation = async (req, res) => {
    try {
        const { school, degree, field, startDate, endDate, currentlyWorking, grade, description, skills } = req.body;
        const updateData = ({
            school,
            degree,
            field,
            startDate,
            endDate,
            currentlyWorking,
            grade,
            description,
            skills
        })
        const education = await Education.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.status(200).json({
            message: "Education updated successfully!", education
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}