const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.API_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid Token"
        })
    }
}