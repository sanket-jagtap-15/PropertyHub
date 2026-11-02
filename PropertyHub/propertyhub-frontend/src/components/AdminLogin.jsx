
import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://propertyhub-backend-ey9t.onrender.com";

export default function AdminLogin({ onLogin, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { username, password }
      );

      onLogin(response.data);
    } catch (err) {
      setError(
        err.response?.data || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4 mx-auto" style={{ maxWidth: "420px" }}>
      <h3 className="text-center mb-4">Admin Login</h3>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Admin Email</label>
          <input
            type="email"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary w-100 mt-2"
          onClick={onCancel}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
}
