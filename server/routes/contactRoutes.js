const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/contact", contactController.saveMessage);
router.get("/contact", contactController.getMessages);
router.delete("/contact/:id", contactController.deleteMessage);

module.exports = router;
