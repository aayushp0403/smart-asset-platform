const Booking = require("../models/Booking");
const Asset = require("../models/Asset");

// user: request a booking
exports.createBooking = async (req, res) => {
  try {
    const { assetId, quantityRequested, startDate, endDate, purpose } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // check available quantity
    if (quantityRequested > asset.availableQuantity)
      return res.status(400).json({ message: "Not enough quantity available" });

    const booking = await Booking.create({
      userId: req.user.id,
      assetId,
      quantityRequested,
      startDate,
      endDate,
      purpose,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// user: get own bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("assetId", "name category")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin: get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("assetId", "name category")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin: approve booking
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    const asset = await Asset.findById(booking.assetId);

    // re-check quantity at approval time
    if (booking.quantityRequested > asset.availableQuantity)
      return res.status(400).json({ message: "Insufficient quantity now" });

    // deduct from available
    asset.availableQuantity -= booking.quantityRequested;
    if (asset.availableQuantity === 0) asset.status = "unavailable";
    await asset.save();

    booking.status = "approved";
    booking.issuedAt = new Date();
    booking.adminNote = req.body.adminNote || "";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin: reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    booking.status = "rejected";
    booking.adminNote = req.body.adminNote || "";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin: mark as returned
exports.returnBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "approved")
      return res.status(400).json({ message: "Only approved bookings can be returned" });

    const asset = await Asset.findById(booking.assetId);

    // restore quantity
    asset.availableQuantity += booking.quantityRequested;
    if (asset.availableQuantity > 0) asset.status = "available";
    await asset.save();

    booking.status = "returned";
    booking.returnedAt = new Date();
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin: get overdue bookings
exports.getOverdueBookings = async (req, res) => {
  try {
    const now = new Date();
    const overdue = await Booking.find({
      status: "approved",
      endDate: { $lt: now },
    })
      .populate("userId", "name email")
      .populate("assetId", "name category");
    res.json(overdue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};