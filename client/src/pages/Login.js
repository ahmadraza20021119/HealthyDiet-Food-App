import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract role from query params
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "user";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password, role });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        localStorage.setItem("userInfoSubmitted", "true"); // Always bypass assessment for returning logins
        navigate("/products");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-header">
          <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
          <p>Enter your credentials to access your dashboard.</p>
        </div>

        {error && <div className="error-msg-auth">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn-submit">Sign In</button>
        </form>

        <div className="auth-footer">
          New to HealthyDiet?
          <Link to="/register-options" className="auth-link">Create an account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
