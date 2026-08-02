const express = require("express")
const router = express.Router()

const { addCertificate, removeCertificate, updateCertificate, getAllCertificate } = require("../controllers/certificateController")

router.get("/certificates", getAllCertificate)
router.post("/certificates", addCertificate)
router.delete("/certificates/:id", removeCertificate)
router.patch("/certificates/:id", updateCertificate)

module.exports = router