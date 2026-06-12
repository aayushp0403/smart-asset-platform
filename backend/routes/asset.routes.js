const express = require("express");
const router = express.Router();
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} = require("../controllers/asset.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", protect, getAllAssets);
router.get("/:id", protect, getAssetById);
router.post("/", protect, adminOnly, createAsset);
router.put("/:id", protect, adminOnly, updateAsset);
router.delete("/:id", protect, adminOnly, deleteAsset);

module.exports = router;