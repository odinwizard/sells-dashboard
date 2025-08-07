const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/"});
const {getFilteredSales, getProductDistribution, getRegionDistribution, getSalesSummery, getSalesTrend} = require("../controllers/sales.controller");
const {uploadFile} = require("../controllers/upload.controller");

router.post("/upload", upload.single('file'), uploadFile);

router.get("/summery", getSalesSummery);
router.get("/sales", getFilteredSales);
router.get("/trend", getSalesTrend);
router.get("/products", getProductDistribution);
router.get("/regions", getRegionDistribution);

module.exports = router;
