const {
    Schema,
    model
} = require("mongoose")

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

const ContactModel = model("contact", ContactSchema);
module.exports = ContactModel