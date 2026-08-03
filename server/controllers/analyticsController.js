const Analytics = require("../models/Analytics")

exports.increaseVisitor = async (req, res) => {
    try {

        let analytics = await Analytics.findOne();

        if (!analytics) {
            analytics = await Analytics.create({});
        }

        analytics.totalVisitors += 1;

        await analytics.save();

        res.status(200).json({
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.increaseResumeDownload = async (req, res) => {
    try {

        let analytics = await Analytics.findOne();

        if (!analytics) {
            analytics = await Analytics.create({});
        }

        analytics.resumeDownloads += 1;

        await analytics.save();

        res.status(200).json({
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAnalytics = async (req, res) => {
    try {

        const analytics = await Analytics.findOne();

        res.status(200).json({
            success: true,
            analytics
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};