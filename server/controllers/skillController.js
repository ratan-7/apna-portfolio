const Skill = require("../models/Skill.js")


exports.getAllSkills = async (req, res) => {
    const skills = await Skill.find();
    if (skills.length == 0) {
        return res.status(200).json({
            message: "not found any skills"
        })
    }
    res.status(200).json(
        skills
    )
}
exports.addSkill = async (req, res) => {
    try {
        const { name, level, catagory, icon, order } = req.body;
        const skill = new Skill({
            name,
            level,
            catagory,
            icon,
            order
        })
        await skill.save();
        res.status(200).json({
            message: "New skill added!", skill: skill
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Skill removed successfully!", skill
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateSkill = async (req, res) => {
    try {
        const { name, level, catagory, icon, order } = req.body;
        const updateData = ({
            name,
            level,
            catagory,
            icon,
            order
        })
        const skill = await Skill.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.status(200).json({
            message: "Skill update successfully!", skill
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

