const express = require("express");

const {
  createAsset,
  getAssets,
  updateAsset,
  archiveAsset,
  assignAsset,
  unassignAsset,
  getMyAssets,
} = require("../controllers/assetController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

// Asset Management
router.post("/", protect, adminOnly, createAsset);
router.get("/", protect, adminOnly, getAssets);
router.put("/:id", protect, adminOnly, updateAsset);
// Employee: View their own assigned assets
router.get("/my-assets", protect, getMyAssets);

// Archive asset
router.patch("/:id/archive", protect, adminOnly, archiveAsset);

// Assign asset to employee
router.patch("/:id/assign", protect, adminOnly, assignAsset);

// Unassign asset from employee
router.patch("/:id/unassign", protect, adminOnly, unassignAsset);

module.exports = router;
