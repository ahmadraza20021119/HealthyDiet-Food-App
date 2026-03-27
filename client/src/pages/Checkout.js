import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard,
    Truck,
    CheckCircle,
    ArrowLeft,
    ShieldCheck,
    Smartphone,
    MapPin,
    Package
} from "lucide-react";
import confetti from "canvas-confetti";
import "../styles/App.css";

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        pincode: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (storedCart.length === 0) {
            navigate("/cart");
        }
        setCart(storedCart);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.name) {
            setAddress(prev => ({ ...prev, fullName: user.name }));
        }
    }, [navigate]);

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const fullAddress = `${address.street}, ${address.city} - ${address.pincode}`;
            const response = await axios.post(
                "http://localhost:5000/order",
                {
                    products: cart,
                    shippingAddress: fullAddress,
                    paymentMethod: paymentMethod,
                    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                confetti({
                    particleCount: 200,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#3b82f6', '#fbbf24']
                });

                localStorage.removeItem("cart");
                setOrderId(response.data.orderId);
                setStep(4); // Show success
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page-modern">
            <div className="checkout-container">
                <header className="checkout-header">
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft size={18} /> Back to Cart
                    </button>
                    <h1>Secure Checkout</h1>
                    <div className="checkout-steps">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step >= 4 ? 'active' : ''}`}>4</div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="checkout-step-content"
                        >
                            <div className="checkout-section">
                                <h2><Truck size={20} /> Shipping Details</h2>
                                <div className="address-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input name="fullName" value={address.fullName} onChange={handleInputChange} placeholder="John Doe" />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input name="phone" value={address.phone} onChange={handleInputChange} placeholder="10-digit mobile" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <textarea name="street" value={address.street} onChange={handleInputChange} placeholder="Flat, House no., Building, Company, Apartment" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input name="city" value={address.city} onChange={handleInputChange} placeholder="Your City" />
                                        </div>
                                        <div className="form-group">
                                            <label>Pincode</label>
                                            <input name="pincode" value={address.pincode} onChange={handleInputChange} placeholder="6 digits" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="checkout-primary-btn"
                                    onClick={() => setStep(2)}
                                    disabled={!address.street || !address.phone}
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="checkout-step-content"
                        >
                            <div className="checkout-section">
                                <h2><CreditCard size={20} /> Payment Option</h2>
                                <div className="payment-options">
                                    <label className={`payment-card ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                                        <Smartphone className="icon" />
                                        <div className="details">
                                            <strong>UPI Payment</strong>
                                            <span>Google Pay, PhonePe, Paytm</span>
                                        </div>
                                    </label>
                                    <label className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                        <CreditCard className="icon" />
                                        <div className="details">
                                            <strong>Credit / Debit Card</strong>
                                            <span>Visa, Mastercard, RuPay</span>
                                        </div>
                                    </label>
                                    <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        <Truck className="icon" />
                                        <div className="details">
                                            <strong>Cash on Delivery</strong>
                                            <span>Pay at your doorstep</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="order-summary-box">
                                    <div className="summary-title">Order Summary</div>
                                    <div className="summary-item">
                                        <span>Items ({cart.length})</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Delivery</span>
                                        <span className="free">FREE</span>
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="total-row">
                                        <span>Amount to Pay</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    className="checkout-primary-btn"
                                    onClick={() => paymentMethod === 'cod' ? handlePlaceOrder() : setStep(3)}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : (paymentMethod === 'cod' ? "Place Order" : `Proceed to Pay ₹${totalPrice}`)}
                                </button>
                                <div className="secure-info">
                                    <ShieldCheck size={14} /> Encrypted & Secure Payment
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="checkout-step-content"
                        >
                            <div className="checkout-section">
                                <h2><ShieldCheck size={20} /> Secure Payment Gateway</h2>
                                {paymentMethod === 'upi' ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                                            <div style={{ width: '150px', height: '150px', background: 'url(https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg) no-repeat center', backgroundSize: 'contain', margin: '0 auto', opacity: 0.8 }}></div>
                                            <p style={{ marginTop: '1rem', fontWeight: '500', fontSize: '1.1rem' }}>Scan to pay ₹{totalPrice}</p>
                                        </div>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Open your UPI app and scan the QR code to complete payment.</p>
                                    </div>
                                ) : (
                                    <div className="address-form" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" maxLength="5" />
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input type="password" placeholder="•••" maxLength="4" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Cardholder Name</label>
                                            <input type="text" placeholder="Name on Card" />
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="checkout-primary-btn"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Processing payment securely..." : `Confirm Payment of ₹${totalPrice}`}
                                </button>
                                <button
                                    className="checkout-secondary-btn"
                                    onClick={() => setStep(2)}
                                    disabled={loading}
                                    style={{ marginTop: '1rem', background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                    Cancel & Go Back
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="success-section"
                        >
                            <div className="success-icon">
                                <CheckCircle size={80} color="#10b981" />
                            </div>
                            <h1>Order Success!</h1>
                            <p>Thank you for choosing us. Your nutritional journey is being prepared by our chefs.</p>
                            <div className="order-badge">
                                Order ID: #{orderId || '...'}
                            </div>
                            <button className="checkout-primary-btn" onClick={() => navigate("/profile")}>
                                View My Orders
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <aside className="checkout-sidebar">
                    <div className="sticky-sidebar">
                        <h3>Your Cart</h3>
                        <div className="sidebar-items">
                            {cart.map(item => (
                                <div key={item.id} className="sidebar-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="info">
                                        <span>{item.name}</span>
                                        <strong>₹{item.price} x {item.quantity}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
