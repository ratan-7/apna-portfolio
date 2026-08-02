const {
    Schema,
    model
} = require("mongoose")

const EducationSchema = new Schema({
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    field: {
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
    grade: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    skills: [String]
},
    { timestamps: true }
)

const EducationModel = model("education", EducationSchema)
module.exports = EducationModel