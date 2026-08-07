const SocialLinks = require("../models/SocialLinks.js");

exports.getSocialLinks = async (req, res) => {
    try {
        let social = await SocialLinks.findOne();
        if (!social) {
            social = await SocialLinks.create({});
        }
        res.status(200).json(social);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSocialLinks = async (req, res) => {
    try {
        const { resumeUrl, github, linkedin, leetcode, youtube, instagram, email, phone } = req.body;

        const social = await SocialLinks.findOneAndUpdate(
            {},
            { resumeUrl, github, linkedin, leetcode, youtube, instagram, email, phone },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Social links updated successfully!", social });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
