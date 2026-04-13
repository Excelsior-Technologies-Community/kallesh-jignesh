const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");

router.get("/", portfolioController.getAllPortfolios);
router.post("/", portfolioController.createPortfolio);
router.put("/:id", portfolioController.updatePortfolio);
router.delete("/:id", portfolioController.deletePortfolio);

module.exports = router;
