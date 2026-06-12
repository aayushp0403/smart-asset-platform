import { useState } from "react";
import API from "../api/axios";

const BookingModal = ({ asset, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    quantityRequested: 1,
    startDate: "",
    endDate: "",
    purpose: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/bookings", { assetId: asset._id, ...form });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Book — {asset.name}</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <label className="block text-sm mb-1">Quantity (max: {asset.availableQuantity})</label>
        <input
          type="number"
          min={1}
          max={asset.availableQuantity}
          value={form.quantityRequested}
          onChange={(e) => setForm({ ...form, quantityRequested: +e.target.value })}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="block text-sm mb-1">Start Date</label>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="block text-sm mb-1">End Date</label>
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="block text-sm mb-1">Purpose</label>
        <textarea
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-4"
          rows={3}
        />

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;