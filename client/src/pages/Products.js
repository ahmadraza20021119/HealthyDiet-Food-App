import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Star, Clock, Plus, Filter, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import "../styles/App.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chefChat, setChefChat] = useState([]);
  const [chefChatInput, setChefChatInput] = useState('');
  const [chefChatLoading, setChefChatLoading] = useState(false);

  const fetchAiSuggestion = useCallback(async (userInfo) => {
    setAiLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "As my elite Executive Chef and Clinical Nutritionist, please provide EXACTLY 2 distinct, delicious, and highly specific recipe recommendations I can cook at home that fit my exact profile. Provide a brief 3-step cooking instruction for each, and briefly explain why they fit my metabolic goals.",
          userProfile: userInfo
        })
      });
      const data = await resp.json();
      setAiSuggestion(data.reply);
    } catch (e) {
      console.error("Error fetching AI suggestion:", e);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setAiSuggestion(null);
    try {
      let url = "http://localhost:5000/products";
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

      if (!viewAll) {
        const goal = userInfo.healthGoal;
        const type = userInfo.dietaryPreference;
        if (goal || type) {
          url += `?goal=${goal}&type=${type}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);

      // Removed automatic AI call - now triggered by button

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [viewAll]);

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
    const isSubmitted = localStorage.getItem("userInfoSubmitted") === "true";
    // Only redirect if NOT admin and NO userInfo and NOT explicitly skipped/submitted
    if (!userInfoRaw && !isAdmin && !isSubmitted) {
      // Small check for the case where state is updating
      const checkUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (checkUser.role !== "admin") {
        navigate("/userinfo");
        return;
      }
    }

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    fetchProducts();
  }, [navigate, viewAll, isAdmin, fetchProducts]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: rect.top / window.innerHeight, x: rect.left / window.innerWidth },
      colors: ['#10b981', '#3b82f6', '#ffffff']
    });
  };

  const handleRemoveFromCart = (e, productId) => {
    e.stopPropagation();
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleChefChatSubmit = async (e) => {
    e.preventDefault();
    if (!chefChatInput.trim()) return;

    const userMessage = { role: 'user', content: chefChatInput };
    setChefChat(prev => [...prev, userMessage]);
    setChefChatInput('');
    setChefChatLoading(true);

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const context = `Context: We are discussing these recipes: \n ${aiSuggestion} \n\n User Question: ${chefChatInput}`;

    try {
      const resp = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: context,
          userProfile: userInfo
        })
      });
      const data = await resp.json();
      setChefChat(prev => [...prev, { role: 'chef', content: data.reply }]);
    } catch (err) {
      console.error("Chef chat error:", err);
      setChefChat(prev => [...prev, { role: 'chef', content: 'Apologies, my kitchen is currently overwhelmed!' }]);
    } finally {
      setChefChatLoading(false);
    }
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          
          <div className="search-bar-modern" style={{ marginTop: '25px', display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '12px 25px', borderRadius: '50px', border: '1px solid var(--border-color)', maxWidth: '500px', margin: '25px auto 40px' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search by meal name or ingredient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', marginLeft: '15px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }}
            />
          </div>

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
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, idx) => (
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
                  {cart.some(item => item.id === product.id) ? (
                    <button className="remove-cart-mini" onClick={(e) => handleRemoveFromCart(e, product.id)} title="Remove from cart">
                      <Trash2 size={20} />
                    </button>
                  ) : (
                    <button className="add-cart-mini" onClick={(e) => handleAddToCart(e, product)} title="Add to cart">
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-products" style={{ gridColumn: '1 / -1' }}>
            <div className="no-products-icon">🍽️</div>
            <h3>No meals found</h3>
            <p>{viewAll ? "Our kitchen is prepping something new! Check back soon." : "We don't have a pre-made meal fitting your exact criteria right now."}</p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
              {!viewAll && <button className="btn-modern-outline" onClick={() => setViewAll(true)}>View All Meals</button>}
              <button className="btn-modern" onClick={() => navigate('/userinfo')}>Update Profile</button>
            </div>
          </div>
        )}
      </div>

      {!viewAll && (
        <motion.div 
          className="ai-suggestion-box" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '40px', background: 'var(--bg-secondary)', padding: '25px', borderRadius: '20px', textAlign: 'left', border: '1.5px solid var(--accent-primary)', maxWidth: '1000px', margin: '40px auto 0' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '18px', margin: 0 }}><Sparkles size={20} color="#10b981"/> Chef's Custom Recipes</h4>
          </div>
          {aiLoading ? (
            <p style={{fontStyle:'italic', color:'var(--text-secondary)'}}>Chef is reviewing your profile and designing 2 custom recipes...</p>
          ) : aiSuggestion ? (
            <div>
              <div className="message-content" style={{color:'var(--text-primary)', fontSize:'15px', lineHeight:'1.8'}}>
                <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
              </div>
              
              <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px', fontSize: '16px' }}>Discuss these recipes with the Chef</h4>
                
                <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chefChat.map((msg, i) => (
                     <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-primary)', color: msg.role === 'user' ? 'white' : 'var(--text-primary)', padding: '10px 15px', borderRadius: '15px', maxWidth: '80%', fontSize: '14px', border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)' }}>
                       <b style={{display: 'block', marginBottom: '4px'}}>{msg.role === 'user' ? 'You' : 'Chef'}:</b> 
                       <div className="message-content">
                         <ReactMarkdown>{msg.content}</ReactMarkdown>
                       </div>
                     </div>
                  ))}
                  {chefChatLoading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>Chef is typing...</div>}
                </div>

                <form onSubmit={handleChefChatSubmit} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. Can I substitute chicken with tofu in recipe #2?" 
                    value={chefChatInput}
                    onChange={(e) => setChefChatInput(e.target.value)}
                    style={{ flex: 1, padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <button type="submit" disabled={chefChatLoading || !chefChatInput.trim()} className="btn-modern" style={{ padding: '0 20px', borderRadius: '12px' }}>Send</button>
                </form>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Want something unique? Let our Chef design a custom recipe for you.</p>
              <button 
                className="btn-modern" 
                onClick={() => fetchAiSuggestion(JSON.parse(localStorage.getItem("userInfo") || "{}"))}
                style={{ padding: '12px 25px' }}
              >
                <Sparkles size={18} style={{ marginRight: '8px' }} /> Cook Custom Recipes
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Products;
