const Asset = require("../models/Asset");

// get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single asset
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create asset (admin)
exports.createAsset = async (req, res) => {
  try {
    const { name, category, totalQuantity, description } = req.body;
    const asset = await Asset.create({
      name,
      category,
      totalQuantity,
      availableQuantity: totalQuantity, // starts fully available
      description,
    });
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update asset (admin)
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete asset (admin)
exports.deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};