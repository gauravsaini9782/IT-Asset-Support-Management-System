const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
    },

    assetTag: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
    },

    model: {
      type: String,
    },

    serialNumber: {
      type: String,
    },

    status: {
      type: String,
      enum: ["available", "assigned", "under repair", "archived"],
      default: "available",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    purchaseDate: {
      type: Date,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema);