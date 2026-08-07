const cloudinary = require("../config/cloudinary.js");

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Koi file nahi mili" });
        }

        // PDF/ZIP jaisi non-image files ko "raw" bhejna zaroori hai —
        // "image" type ke through Cloudinary in files ko block kar deta hai
        // (security policy, 2023 se)
        const isImage = req.file.mimetype.startsWith("image/");
        const resourceType = isImage ? "image" : "raw";

        const streamUpload = () =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "apna-portfolio",
                        resource_type: resourceType,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

        const result = await streamUpload();

        res.status(200).json({
            message: "File uploaded successfully!",
            url: result.secure_url,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};