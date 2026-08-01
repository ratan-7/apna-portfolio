const {
    Schema,
    model
} = require("mongoose")

const SkillSchema = new Schema({
    name: {
        type: String
    },
    level: {
        type: Number
    },
    catagory: {
        type: String
    },
    icon: {
        type: String
    },
    Order: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }
)

const SkillModel = model("skill", SkillSchema);
module.exports = SkillModel;