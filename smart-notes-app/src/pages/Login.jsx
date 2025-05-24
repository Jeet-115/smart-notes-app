import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <form onSubmit={handleLogin} className="g-white dark:bg-gray-800 dark:text-white p-8 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Log In</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border dark:border-gray-600 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border dark:border-gray-600 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Log In
        </button>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account? <a href="/signup" className="text-indigo-600 font-semibold">Sign up</a>
        </p>
      </form>
    </div>
  );
}
