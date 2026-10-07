const Asset = require("../models/Asset");
const User = require("../models/User");

// Create a new asset

const createAsset = async (req, res) => {
  try {
    const allowedFields = [
      "assetName",
      "assetTag",
      "category",
      "brand",
      "model",
      "serialNumber",
      "purchaseDate",
      "notes",
    ];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid fields in asset creation",
        invalidFields,
      });
    }

    const asset = await Asset.create({
      ...req.body,
      status: "available",
      assignedTo: null,
    });

    res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (error) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Asset tag already exists",
      });
    }

    // Other server errors
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
    res.status(500).json({ message: "Server error" });
  }
};

// Update an asset
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    res.status(500).json({ message: "Server error" });
  }
};

// Archive an asset instead of permanently deleting it
const archiveAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      {
        status: "archived",
        assignedTo: null,
      },
      { new: true, runValidators: true },
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset archived successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Assign an available asset to an active employee
const assignAsset = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required",
      });
    }

    const employee = await User.findOne({
      _id: employeeId,
      role: "employee",
      accountStatus: "active",
    });

    if (!employee) {
      return res.status(404).json({
        message: "Active employee not found",
      });
    }

    // Atomic update prevents two assignments of the same asset
    const asset = await Asset.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "available",
        assignedTo: null,
      },
      {
        $set: {
          status: "assigned",
          assignedTo: employee._id,
        },
      },
      { new: true, runValidators: true },
    );

    if (!asset) {
      return res.status(400).json({
        message: "Asset not found or not available for assignment",
      });
    }

    res.status(200).json({
      message: "Asset assigned successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Unassign an asset from an employee
const unassignAsset = async (req, res) => {
  try {
    const asset = await Asset.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "assigned",
        assignedTo: { $ne: null },
      },
      {
        $set: {
          status: "available",
          assignedTo: null,
        },
      },
      { new: true, runValidators: true },
    );

    if (!asset) {
      return res.status(400).json({
        message: "Asset not found or not currently assigned",
      });
    }

    res.status(200).json({
      message: "Asset unassigned successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get assets assigned to the logged-in employee
const getMyAssets = async (req, res) => {
  try {
    const assets = await Asset.find({
      assignedTo: req.user.id,
      status: "assigned",
    });

    res.status(200).json(assets);
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
  archiveAsset,
  assignAsset,
  unassignAsset,
  getMyAssets,
};
