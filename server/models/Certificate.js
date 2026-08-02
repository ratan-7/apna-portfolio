const {
    Schema,
    model
} = require("mongoose")

const CertificateSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date
    },
    certificateUrl: {
        type: String
    },
    image: {
        type: String
    }
},
    { timestamps: true }
)

const CertificateModel = model("certificate", CertificateSchema)

module.exports = CertificateModel