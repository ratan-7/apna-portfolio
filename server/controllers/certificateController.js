const Certificate = require("../models/Certificate")

exports.getAllCertificate = async (req, res) => {
    try {
        const certificates = await Certificate.find();
        if (certificates.length == 0) {
            return res.status(200).json({
                message: "certificate not found"
            })
        }
        res.status(200).json({
            certificates
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.addCertificate = async (req, res) => {
    try {
        const { title, issuer, issueDate, certificateUrl, image } = req.body;
        const certificate = new Certificate({
            title,
            issuer,
            issueDate,
            certificateUrl,
            image
        })
        await certificate.save();
        res.status(200).json({
            message: "Certificate added successfully!", certificate
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.removeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "Certificate removed successfully!", certificate
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateCertificate = async (req, res) => {
    try {
        const { title, issuer, issueDate, certificateUrl, image } = req.body;
        const updateData = ({
            title,
            issuer,
            issueDate,
            certificateUrl,
            image
        })
        const certificate = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.status(200).json({
            message: "Certificate updated successfully!", certificate
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}