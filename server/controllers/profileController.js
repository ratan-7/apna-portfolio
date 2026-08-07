const Profile = require("../models/Profile.js");


exports.getProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({});
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, role, location, tagline, bio, readme } = req.body;

        const profile = await Profile.findOneAndUpdate(
            {},
            { name, role, location, tagline, bio, readme },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Profile updated successfully!", profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
