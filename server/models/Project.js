const {
    Schema,
    model
} = require("mongoose")

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],

    image: {
        type: String,
    },
    url: {
        type: String,
    },
    githubUrl: {
        type: String,
    }
},
    { timestamps: true }
)

const ProjectModel = model("project", ProjectSchema);
module.exports = ProjectModel;