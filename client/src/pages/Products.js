import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Star, Clock, Plus, Filter, Sparkles } from "lucide-react";
import "../styles/App.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      if (user.role === "admin") {
        setIsAdmin(true);
        setViewAll(true); // Default to all for admin
      }
    }

    const userInfoRaw = localStorage.getItem("userInfo");
    // Only redirect if NOT admin and NO userInfo
    if (!userInfoRaw && !isAdmin) {
      // Small check for the case where state is updating
      const checkUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (checkUser.role !== "admin") {
        navigate("/userinfo");
        return;
      }
    }

    fetchProducts();
  }, [navigate, viewAll, isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/products";

      if (!viewAll) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const goal = userInfo.healthGoal;
        const type = userInfo.dietaryPreference;
        if (goal || type) {
          url += `?goal=${goal}&type=${type}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const rect = e.target.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: rect.top / window.innerHeight, x: rect.left / window.innerWidth },
      colors: ['#10b981', '#3b82f6', '#ffffff']
    });
  };

  const SkeletonItem = () => (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
      <div className="skeleton skeleton-meta"></div>
    </div>
  );

  return (
    <div className="products-container-modern">
      <div className="products-controls">
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="badge-modern">{viewAll ? "Browse Library" : "Tailored For You"}</span>
          <h1>{viewAll ? "All Healthy" : "Recommended"} <span className="gradient-text">Meals</span></h1>
          <p>
            {viewAll
              ? "Exploring our complete collection of nutrient-dense, chef-crafted meals."
              : "Based on your metabolic profile and health goals, we've curated these perfect matches."}
          </p>
        </motion.div>

        <div className="filter-toggle-container">
          <button
            className={`toggle-btn ${!viewAll ? "active" : ""}`}
            onClick={() => setViewAll(false)}
          >
            <Sparkles size={16} /> Recommended
          </button>
          <button
            className={`toggle-btn ${viewAll ? "active" : ""}`}
            onClick={() => setViewAll(true)}
          >
            <Filter size={16} /> All Meals
          </button>
        </div>
      </div>

      <div className="product-grid-modern">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonItem key={i} />)
        ) : products.length > 0 ? (
          products.map((product, idx) => (
            <motion.div
              key={product.id}
              className="product-card-modern"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/product/${product.id}`)}
              whileHover={{ y: -10 }}
            >
              <div className="product-image-wrapper">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                />
                <div className="product-price-badge">₹{product.price}</div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description ? product.description.substring(0, 65) + "..." : "No description available."}</p>
                <div className="product-meta-row">
                  <div className="meta-pills">
                    <span><Star size={14} fill="currentColor" /> {product.rating || "4.8"}</span>
                    <span><Clock size={14} /> {product.duration || "20m"}</span>
                  </div>
                  <button className="add-cart-mini" onClick={(e) => handleAddToCart(e, product)}>
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🍽️</div>
            <h3>No meals found</h3>
            <p>{viewAll ? "Our kitchen is prepping something new! Check back soon." : "Try adjusting your dietary preferences or view all meals."}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {!viewAll && <button className="btn-modern-outline" onClick={() => setViewAll(true)}>View All Meals</button>}
              <button className="btn-modern" onClick={() => navigate('/userinfo')}>Update Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
