const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    quantityRequested: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned", "overdue"],
      default: "pending",
    },
    purpose: { type: String, default: "" },
    adminNote: { type: String, default: "" },
    issuedAt: { type: Date },
    returnedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);