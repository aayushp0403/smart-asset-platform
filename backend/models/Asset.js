const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    totalQuantity: { type: Number, required: true, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["available", "low_stock", "unavailable"],
      default: "available",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// auto-update status based on available qty
assetSchema.pre("save", function (next) {
  if (this.availableQuantity === 0) this.status = "unavailable";
  else if (this.availableQuantity <= 2) this.status = "low_stock";
  else this.status = "available";
  next();
});

module.exports = mongoose.model("Asset", assetSchema);