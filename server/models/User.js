const {
    Schema,
    model
} = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "admin"
    }

},
    {
        timestamps: true
    }
);

const UserModel = model("user", UserSchema)

module.exports = UserModel