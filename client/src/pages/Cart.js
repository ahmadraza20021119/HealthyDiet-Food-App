import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import "../styles/App.css";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCart = cart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const user = localStorage.getItem("user");

    const handleCheckout = () => {
        if (!user) {
            navigate("/login-options");
            return;
        }

        // Navigate to checkout page instead of just clearing
        navigate("/checkout");
    };

    return (
        <div className="cart-modern-page">
            <div className="cart-container-modern">
                <header className="cart-header-modern">
                    <div className="cart-icon-wrapper">
                        <ShoppingBag size={32} />
                        {cart.length > 0 && <span className="cart-dot"></span>}
                    </div>
                    <h1>Your Basket</h1>
                    <p>Fuel your body with nutrition-rich meals.</p>
                </header>

                <div className="cart-content-grid">
                    <div className="cart-items-section">
                        <AnimatePresence>
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="cart-card-modern"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                    >
                                        <div className="cart-item-img">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cart-item-meta">
                                            <h3>{item.name}</h3>
                                            <p>Chef Selected • Fresh</p>
                                            <div className="cart-item-price-mobile">₹{item.price}</div>
                                        </div>
                                        <div className="cart-qty-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                        </div>
                                        <div className="cart-item-subtotal">
                                            ₹{item.price * item.quantity}
                                        </div>
                                        <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                                            <X size={18} />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div className="empty-cart-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="empty-icon">🍽️</div>
                                    <h3>Empty Plate?</h3>
                                    <p>Your basket looks a bit lonely. Let's find some delicious fuel.</p>
                                    <Link to="/products" className="browse-btn-modern">Browse Menu</Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {cart.length > 0 && (
                        <motion.div
                            className="cart-summary-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>₹{totalPrice}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <strong className="free-text">FREE</strong>
                            </div>
                            <div className="summary-row total">
                                <span>Estimated Total</span>
                                <strong>₹{totalPrice}</strong>
                            </div>

                            <button className="checkout-btn-modern" onClick={handleCheckout}>
                                Secure Checkout <ArrowRight size={18} />
                            </button>

                            <div className="secure-badge">
                                <ShieldCheck size={16} />
                                <span>SSL Secure Encryption Active</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
