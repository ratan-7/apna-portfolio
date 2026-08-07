const Analytic = require("../models/Analytics.js");

async function getOrCreateDoc() {
    let doc = await Analytic.findOne();
    if (!doc) {
        doc = await Analytic.create({});
    }
    return doc;
}

// Admin only — dashboard ke liye (poora document)
exports.getAnalytics = async (req, res) => {
    try {
        const doc = await getOrCreateDoc();
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Public — sirf visitor/download counts, koi sensitive data nahi
// Systems section me dikhane ke liye
exports.getPublicStats = async (req, res) => {
    try {
        const doc = await getOrCreateDoc();
        res.status(200).json({
            totalVisitors: doc.totalVisitors,
            resumeDownloads: doc.resumeDownloads,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.incrementVisitor = async (req, res) => {
    try {
        const doc = await Analytic.findOneAndUpdate(
            {},
            { $inc: { totalVisitors: 1 } },
            { new: true, upsert: true }
        );
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.incrementResumeDownload = async (req, res) => {
    try {
        const doc = await Analytic.findOneAndUpdate(
            {},
            { $inc: { resumeDownloads: 1 } },
            { new: true, upsert: true }
        );
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};