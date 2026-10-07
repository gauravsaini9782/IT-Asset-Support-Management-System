const express = require("express");
const {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
} = require("../controllers/assetController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createAsset);
router.get("/", protect, adminOnly, getAssets);
router.put("/:id", protect, adminOnly, updateAsset);
router.delete("/:id", protect, adminOnly, deleteAsset);

module.exports = router;