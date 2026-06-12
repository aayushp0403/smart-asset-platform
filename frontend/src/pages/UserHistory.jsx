import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const STATUS_COLORS = {
  pending: "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
  returned: "#6b7280",
};

const UserHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  // chart data
  const statusCounts = ["pending", "approved", "rejected", "returned"].map((s) => ({
    status: s.charAt(0).toUpperCase() + s.slice(1),
    count: bookings.filter((b) => b.status === s).length,
  }));

  const statusColor = (status) => {
    if (status === "approved") return "text-green-600";
    if (status === "rejected") return "text-red-500";
    if (status === "returned") return "text-gray-400";
    return "text-yellow-500";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">My Borrowing History</h1>

      {/* summary chart */}
      <div className="bg-white border rounded-xl p-5 shadow-sm mb-8">
        <h2 className="font-semibold text-lg mb-4">My Booking Summary</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusCounts}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {statusCounts.map((entry, i) => (
                <Cell
                  key={i}
                  fill={STATUS_COLORS[entry.status.toLowerCase()]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* full history table */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">All Requests</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-indigo-50 text-left">
              <tr>
                <th className="px-4 py-2">Asset</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Purpose</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Admin Note</th>
                <th className="px-4 py-2">Returned At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="px-4 py-2">{b.assetId?.name}</td>
                  <td className="px-4 py-2 text-gray-500">{b.assetId?.category}</td>
                  <td className="px-4 py-2">{b.quantityRequested}</td>
                  <td className="px-4 py-2">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(b.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-gray-500">{b.purpose || "—"}</td>
                  <td className={`px-4 py-2 font-semibold capitalize ${statusColor(b.status)}`}>
                    {b.status}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{b.adminNote || "—"}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {b.returnedAt ? new Date(b.returnedAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserHistory;