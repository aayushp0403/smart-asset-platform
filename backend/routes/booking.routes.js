const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  returnBooking,
  getOverdueBookings,
} = require("../controllers/booking.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// user routes
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

// admin routes
router.get("/", protect, adminOnly, getAllBookings);
router.get("/overdue", protect, adminOnly, getOverdueBookings);
router.patch("/:id/approve", protect, adminOnly, approveBooking);
router.patch("/:id/reject", protect, adminOnly, rejectBooking);
router.patch("/:id/return", protect, adminOnly, returnBooking);

module.exports = router;