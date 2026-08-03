const express = require("express")
const router = express.Router()

const { addCertificate, removeCertificate, updateCertificate, getAllCertificate } = require("../controllers/certificateController")
const { verifyToken } = require("../middleware/verifyToken")

router.get("/certificates", getAllCertificate)
router.post("/certificates", verifyToken, addCertificate)
router.delete("/certificates/:id", verifyToken, removeCertificate)
router.patch("/certificates/:id", verifyToken, updateCertificate)

module.exports = router