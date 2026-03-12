import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/Auth.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role") || "user";

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });

            // Auto-login the freshly registered user
            const loginRes = await axios.post("http://localhost:5000/api/auth/login", { email, password, role });
            localStorage.setItem("user", JSON.stringify(loginRes.data.user));

            // Force them to the mandatory initial assessment
            localStorage.removeItem("userInfoSubmitted");
            navigate("/userinfo");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Try a different email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="auth-header">
                    <h2>Setup {role.charAt(0).toUpperCase() + role.slice(1)} Account</h2>
                    <p>Start your journey to a healthier lifestyle today.</p>
                </div>

                {error && <div className="error-msg-auth">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="auth-form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn-submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Join Now"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already a member?
                    <Link to="/login-options" className="auth-link">Sign in instead</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
