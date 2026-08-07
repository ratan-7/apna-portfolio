const {
    Schema,
    model
} = require("mongoose")

const ProfileSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    tagline: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    readme: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
)

const ProfileModel = model("profile", ProfileSchema)
module.exports = ProfileModel
