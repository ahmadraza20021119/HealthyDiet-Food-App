import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, LogOut, Menu, X, Utensils, Moon, Sun } from "lucide-react";
import axios from "axios";
import "../styles/App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [location]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.clear();
    navigate("/login");
  };

  const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").length;

  return (
    <nav className={`premium-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Utensils size={24} />
          </div>
          <span className="logo-text">
            Healthy<span>Diet</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/products" className={location.pathname === "/products" ? "active" : ""}>Menu</Link>
          {userData?.role === 'admin' && <Link to="/admin">Dashboard</Link>}
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <Link to="/cart" className="cart-trigger">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown-wrapper">
              <Link to="/profile" className="profile-pill">
                <div className="avatar-sm">
                  {userData.name?.charAt(0) || "U"}
                </div>
                <span className="user-name-desktop">{userData.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login-options" className="login-nav-btn">Login</Link>
          )}

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mobile-links">
              <Link to="/">Home</Link>
              <Link to="/products">Menu</Link>
              <Link to="/cart">Cart</Link>
              {user ? (
                <>
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout} className="mobile-logout">Logout</button>
                </>
              ) : (
                <Link to="/login-options">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
