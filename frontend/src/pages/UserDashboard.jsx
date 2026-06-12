import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    API.get("/assets").then((res) => setAssets(res.data)).catch(console.error);
  }, []);

  const requestBooking = async (assetId) => {
    try {
      // default 1 day booking
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);

      await API.post("/bookings", {
        assetId,
        quantityRequested: 1,
        startDate,
        endDate
      });
      alert("Booking requested successfully!");
    } catch (err) {
      alert("Booking failed. Check inventory.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      
      <h2 className="text-2xl mb-4">Available Assets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div key={asset._id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-xl font-semibold">{asset.name}</h3>
            <p className="text-gray-600">Category: {asset.category}</p>
            <p className="text-gray-600">Available: {asset.availableQuantity}</p>
            <button
              onClick={() => requestBooking(asset._id)}
              disabled={asset.availableQuantity < 1}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Request Asset
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;