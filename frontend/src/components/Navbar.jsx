import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold tracking-wide">
        AssetHub
      </Link>
      <div className="flex gap-4 items-center">
        {user && (
          <>
            <span className="text-sm opacity-80">
              {user.name} ({user.role})
            </span>
            {user.role === "admin" ? (
              <Link to="/admin" className="text-sm hover:underline">
                Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm hover:underline">
                  Dashboard
                </Link>
                <Link to="/history" className="text-sm hover:underline">
                  My History
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-700 text-sm px-3 py-1 rounded hover:bg-indigo-100"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;