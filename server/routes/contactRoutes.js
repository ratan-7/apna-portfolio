const express = require("express")
const router = express.Router();

const { createContact, deleteContact, getAllContacts, markAsRead } = require("../controllers/contactController.js")

router.get("/contacts", getAllContacts)
router.post("/contacts", createContact)
router.delete("/contacts/:id", deleteContact)
router.patch("/contacts/:id", markAsRead)


module.exports = router;