import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: "", category: "", totalQuantity: 1, description: "",
  });
  const [note, setNote] = useState("");

  const fetchAll = async () => {
    const [b, a] = await Promise.all([API.get("/bookings"), API.get("/assets")]);
    setBookings(b.data);
    setAssets(a.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (id, action) => {
    await API.patch(`/bookings/${id}/${action}`, { adminNote: note });
    setNote("");
    fetchAll();
  };

  const handleAddAsset = async () => {
    await API.post("/assets", newAsset);
    setNewAsset({ name: "", category: "", totalQuantity: 1, description: "" });
    fetchAll();
  };

  const handleDeleteAsset = async (id) => {
    await API.delete(`/assets/${id}`);
    fetchAll();
  };

  const statusColor = (status) => {
    if (status === "approved") return "text-green-600";
    if (status === "rejected") return "text-red-500";
    if (status === "returned") return "text-gray-400";
    return "text-yellow-500";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-8">Admin Dashboard</h1>

      {/* add asset */}
      <div className="bg-white border rounded-xl p-5 mb-10 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Add New Asset</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            placeholder="Asset Name"
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Category"
            value={newAsset.category}
            onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Total Quantity"
            value={newAsset.totalQuantity}
            onChange={(e) => setNewAsset({ ...newAsset, totalQuantity: +e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Description"
            value={newAsset.description}
            onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleAddAsset}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Asset
        </button>
      </div>

      {/* asset list */}
      <div className="bg-white border rounded-xl p-5 mb-10 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">All Assets</h2>
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2">{a.category}</td>
                <td className="px-4 py-2 text-indigo-600 font-semibold">{a.availableQuantity}</td>
                <td className="px-4 py-2">{a.totalQuantity}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteAsset(a._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* all bookings */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">All Booking Requests</h2>
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-left">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Asset</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Dates</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-2">{b.userId?.name}</td>
                <td className="px-4 py-2">{b.assetId?.name}</td>
                <td className="px-4 py-2">{b.quantityRequested}</td>
                <td className="px-4 py-2 text-xs">
                  {new Date(b.startDate).toLocaleDateString()} →{" "}
                  {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td className={`px-4 py-2 font-semibold capitalize ${statusColor(b.status)}`}>
                  {b.status}
                </td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(b._id, "approve")}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(b._id, "reject")}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {b.status === "approved" && (
                    <button
                      onClick={() => handleAction(b._id, "return")}
                      className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                    >
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;