const express = require("express")
const router = express.Router();

const { createContact, deleteContact, getAllContacts, markAsRead } = require("../controllers/contactController.js")
const { verifyToken } = require("../middleware/verifyToken")

router.get("/contacts",verifyToken,  getAllContacts)
router.post("/contacts", createContact)
router.delete("/contacts/:id",verifyToken,  deleteContact)
router.patch("/contacts/:id",verifyToken,  markAsRead)


module.exports = router;