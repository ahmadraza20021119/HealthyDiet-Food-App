import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AuthChoice from "./pages/AuthChoice";
import MealDetail from "./pages/MealDetail";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import "./styles/App.css";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    alert("Access Denied: Admin only!");
    return <Home />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me");
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (err) {
        // If 401, clear local storage as cookie is invalid
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
        }
      }
    };
    checkAuth();
  }, [location.pathname]); // Re-check on navigation

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userinfo" element={<Quiz />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-options" element={<AuthChoice type="login" />} />
        <Route path="/register-options" element={<AuthChoice type="register" />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<MealDetail />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <Chatbot />}
    </>
  );
}
export default App;
