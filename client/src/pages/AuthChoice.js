import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";
import "../styles/Auth.css";

const AuthChoice = ({ type }) => {
    const navigate = useNavigate();

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="auth-header">
                    <h2>{type === 'login' ? 'Welcome Back' : 'Join HealthyDiet'}</h2>
                    <p>Select your account type to proceed with {type}</p>
                </div>

                <div className="auth-choices-grid">
                    <motion.div
                        className="auth-choice-item"
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(type === 'login' ? '/login?role=user' : '/register?role=user')}
                    >
                        <User size={40} className="choice-icon" color="#10b981" />
                        <h3>User</h3>
                        <p>Track macros and order healthy meals.</p>
                    </motion.div>

                    <motion.div
                        className="auth-choice-item"
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(type === 'login' ? '/login?role=admin' : '/register?role=admin')}
                    >
                        <ShieldCheck size={40} className="choice-icon" color="#3b82f6" />
                        <h3>Admin</h3>
                        <p>Manage inventory and user requests.</p>
                    </motion.div>
                </div>

                <div className="auth-footer">
                    {type === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <Link to={type === 'login' ? "/register-options" : "/login-options"} className="auth-link">
                        {type === 'login' ? "Create one now" : "Sign in here"}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthChoice;
