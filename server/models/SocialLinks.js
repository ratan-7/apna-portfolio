const {
    Schema,
    model
} = require("mongoose")

const SocialSchema = new Schema({
    resumeUrl: {
        type: String,
        default: ""
    },

    github: {
        type: String,
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
    },

    leetcode: {
        type: String,
        default: ""
    },

    youtube: {
        type: String,
        default: ""
    },

    instagram: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
)

const SocialModel = model("socialLinks", SocialSchema)
module.exports = SocialModel
