import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b"];

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: "", category: "", totalQuantity: 1, description: "",
  });

  const fetchAll = async () => {
    const [b, a, o] = await Promise.all([
      API.get("/bookings"),
      API.get("/assets"),
      API.get("/bookings/overdue"),
    ]);
    setBookings(b.data);
    setAssets(a.data);
    setOverdue(o.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (id, action) => {
    await API.patch(`/bookings/${id}/${action}`, {});
    fetchAll();
  };

  const handleAddAsset = async () => {
    if (!newAsset.name || !newAsset.category) return;
    await API.post("/assets", newAsset);
    setNewAsset({ name: "", category: "", totalQuantity: 1, description: "" });
    fetchAll();
  };

  const handleDeleteAsset = async (id) => {
    await API.delete(`/assets/${id}`);
    fetchAll();
  };

  // analytics data
  const statusCounts = ["pending", "approved", "rejected", "returned"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: bookings.filter((b) => b.status === s).length,
  }));

  const assetBarData = assets.map((a) => ({
    name: a.name.length > 12 ? a.name.slice(0, 12) + "…" : a.name,
    Available: a.availableQuantity,
    Booked: a.totalQuantity - a.availableQuantity,
  }));

  const statusColor = (status) => {
    if (status === "approved") return "text-green-600";
    if (status === "rejected") return "text-red-500";
    if (status === "returned") return "text-gray-400";
    return "text-yellow-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-8">Admin Dashboard</h1>

      {/* stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Assets", value: assets.length, color: "bg-indigo-50 text-indigo-700" },
          { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "bg-yellow-50 text-yellow-600" },
          { label: "Active Loans", value: bookings.filter(b => b.status === "approved").length, color: "bg-green-50 text-green-600" },
          { label: "Overdue", value: overdue.length, color: "bg-red-50 text-red-600" },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl p-4 shadow-sm ${card.color}`}>
            <p className="text-sm opacity-70">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* booking status pie */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Booking Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* asset availability bar */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Asset Availability</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assetBarData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Available" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Booked" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* overdue alert */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-10">
          <h2 className="font-semibold text-red-600 mb-3">⚠ Overdue Returns ({overdue.length})</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-red-500">
              <tr>
                <th className="px-3 py-1">User</th>
                <th className="px-3 py-1">Asset</th>
                <th className="px-3 py-1">Qty</th>
                <th className="px-3 py-1">Due Date</th>
                <th className="px-3 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((b) => (
                <tr key={b._id} className="border-t border-red-100">
                  <td className="px-3 py-2">{b.userId?.name}</td>
                  <td className="px-3 py-2">{b.assetId?.name}</td>
                  <td className="px-3 py-2">{b.quantityRequested}</td>
                  <td className="px-3 py-2 text-red-500">
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleAction(b._id, "return")}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Mark Returned
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {/* asset inventory table */}
      <div className="bg-white border rounded-xl p-5 mb-10 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Inventory</h2>
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
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
                <td className="px-4 py-2 capitalize">{a.status}</td>
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