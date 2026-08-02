const {
    Schema,
    model
} = require("mongoose");


const ExperienceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    currentlyWorking: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [String]
},
    { timestamps: true }
)

const ExperienceModel = model("experience", ExperienceSchema)
module.exports = ExperienceModel