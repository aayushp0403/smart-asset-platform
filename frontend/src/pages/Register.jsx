import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // register and auto-login
      const { data } = await API.post("/auth/register", form);
      login(data, data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Name" className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;