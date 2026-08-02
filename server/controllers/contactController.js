const Contact = require("../models/Contact")


exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        if (contacts.length == 0) {
            return res.status(200).json({
                message: "contacts not found"
            })
        }
        res.status(200).json({
            contacts
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.createContact = async (req, res) => {
    try {
        const { name, email, subject, message, isRead } = req.body;
        const contact = new Contact({
            name,
            email,
            subject,
            message,
            isRead
        })
        await contact.save();
        res.status(200).json({
            message: "message sent successfully!", contact
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "message deleted successfully!", contact
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.markAsRead = async (req, res) => {
    try {
        const { isRead } = req.body;
        const updateData = ({
            isRead: true
        })
        const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.status(200).json({
            message: "message read by admin", contact
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}








