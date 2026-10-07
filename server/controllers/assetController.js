const Asset = require("../models/Asset");

// Create a new asset
const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);

    res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update an asset
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset updated successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete an asset
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
  req.params.id,
  {
    status: "archived",
    assignedTo: null,
  },
  { new: true }
);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset archived successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
};