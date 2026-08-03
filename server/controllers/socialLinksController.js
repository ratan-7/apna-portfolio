const Social = require("../models/SocialLinks")

exports.getLinks = async (req, res) => {
    try {

        const links = await Social.findOne();

        res.status(200).json({
            success: true,
            links
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateLinks = async (req, res) => {
    try {

        const {
            resumeUrl,
            github,
            linkedin,
            leetcode,
            email,
            phone
        } = req.body;

        let links = await Social.findOne();

        if (!links) {

            links = await Social.create({
                resumeUrl,
                github,
                linkedin,
                leetcode,
                email,
                phone
            });

        } else {

            links.resumeUrl = resumeUrl || links.resumeUrl;
            links.github = github || links.github;
            links.linkedin = linkedin || links.linkedin;
            links.leetcode = leetcode || links.leetcode;
            links.email = email || links.email;
            links.phone = phone || links.phone;

            await links.save();
        }

        res.status(200).json({
            success: true,
            links
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};