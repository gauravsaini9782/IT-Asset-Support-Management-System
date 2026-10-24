const express = require("express");

const {
  createAsset,
  getAssets,
  updateAsset,
  archiveAsset,
  restoreAsset,
  assignAsset,
  unassignAsset,
  getMyAssets,
  deleteAsset,
} = require("../controllers/assetController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

// Employee: View their own assigned assets
router.get("/my-assets", protect, getMyAssets);

// Admin: Asset Management
router.post("/", protect, adminOnly, createAsset);
router.get("/", protect, adminOnly, getAssets);
router.put("/:id", protect, adminOnly, updateAsset);

// Admin: Archive and Restore
router.patch("/:id/archive", protect, adminOnly, archiveAsset);
router.patch("/:id/restore", protect, adminOnly, restoreAsset);

// Admin: Assign and Unassign
router.patch("/:id/assign", protect, adminOnly, assignAsset);
router.patch("/:id/unassign", protect, adminOnly, unassignAsset);

// Admin: Permanently Delete Asset
router.delete("/:id", protect, adminOnly, deleteAsset);

module.exports = router;
