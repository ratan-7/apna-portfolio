const {
    Schema,
    model
} = require("mongoose")

const AnalyticSchema = new Schema({
    totalVisitors: {
        type: Number,
        default: 0
    },
    resumeDownloads: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const AnalyticModel = model("analytic", AnalyticSchema)
module.exports = AnalyticModel