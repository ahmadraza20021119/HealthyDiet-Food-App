import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Mail, Phone, MapPin, ShoppingBag, 
    Activity, Star, 
    Award, Clock, CheckCircle, Zap, TrendingUp
} from "lucide-react";
import "../styles/Profile.css";
import bannerImg from "../images/profile-banner.png";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: "", email: "", phone: "", address: "" });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/orders/me", { withCredentials: true });
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setEditData({
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || ""
            });
            fetchUserOrders();
        } else {
            setLoading(false);
        }
    }, []);

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/auth/update/${user.id}`, editData);
            const updatedUser = { ...user, ...editData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    if (loading) return (
        <div className="profile-loading">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="loading-spinner"
            />
        </div>
    );

    if (!user) return <div className="loading-screen">User not found</div>;

    const macros = {
        protein: userInfo.healthGoal === "muscleGain" ? 85 : 60,
        carbs: userInfo.healthGoal === "weightLoss" ? 40 : 70,
        fats: 55
    };

    const stats = [
        { label: "Orders", value: orders.length, icon: <ShoppingBag size={18} />, color: "#f59e0b" },
        { label: "Points", value: "1,240", icon: <Star size={18} />, color: "#facc15" },
        { label: "Level", value: "Gold", icon: <Award size={18} />, color: "#3b82f6" },
        { label: "Streak", value: "12 Days", icon: <Zap size={18} />, color: "#10b981" }
    ];

    return (
        <div className="profile-premium-wrapper">
            {/* Section 1: Banner (standalone, no overlap) */}
            <div className="profile-banner-section">
                <div 
                    className="profile-banner-bg" 
                    style={{ backgroundImage: `url(${bannerImg})` }}
                >
                    <div className="banner-overlay"></div>
                </div>
            </div>

            {/* Section 2: User Info Bar (completely separate from banner and grid) */}
            <div className="profile-user-bar">
                <motion.div 
                    className="profile-avatar-box"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="avatar-main">
                        {user.name?.charAt(0)}
                        <div className="status-indicator online"></div>
                    </div>
                </motion.div>

                <div className="profile-essential-info">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1>{user.name}</h1>
                        <div className="meta-pills-row">
                            <span className="p-badge premium">
                                <Star size={12} fill="currentColor" /> Premium Member
                            </span>
                            <span className="p-badge-sub">{user.email}</span>
                        </div>
                    </motion.div>
                    
                    <div className="header-actions">
                        <button className="p-glass-btn edit" onClick={() => setIsEditing(!isEditing)}>
                            <User size={16} /> {isEditing ? "View Profile" : "Edit Details"}
                        </button>
                        <button className="p-glass-btn share">Share Profile</button>
                    </div>
                </div>
            </div>

            {/* Section 3: Dashboard Cards Grid */}
            <div className="profile-main-grid">
                <div className="grid-left-col">
                    <motion.div 
                        className="p-dashboard-card stats-overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-unit">
                                <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-data">
                                    <span className="stat-val">{stat.value}</span>
                                    <span className="stat-lab">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div 
                        className="p-dashboard-card nutrition-focus"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="card-header-flex">
                            <h3><Activity size={18} /> Health Blueprint</h3>
                            <button className="text-btn" onClick={() => navigate('/userinfo')}>Adjust Goal</button>
                        </div>
                        
                        <div className="goal-active-badge">
                            <CheckCircle size={14} />
                            <span>Focusing on <strong>{userInfo.healthGoal?.replace(/([A-Z])/g, ' $1') || "General Health"}</strong></span>
                        </div>

                        <div className="macro-dashboard">
                            {['protein', 'carbs', 'fats'].map((macro) => (
                                <div key={macro} className="macro-progress-row">
                                    <div className="macro-info-text">
                                        <span className="macro-n">{macro.charAt(0).toUpperCase() + macro.slice(1)}</span>
                                        <span className="macro-v">{macros[macro]}%</span>
                                    </div>
                                    <div className="macro-progress-bar">
                                        <motion.div 
                                            className={`macro-fill ${macro[0]}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${macros[macro]}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="weekly-insight">
                            <TrendingUp size={16} />
                            <p>You're <strong>8% closer</strong> to your goal than last week!</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid-right-col">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div 
                                key="edit-panel"
                                className="p-dashboard-card info-details-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="card-header-flex">
                                    <h3>Modify My Account</h3>
                                </div>
                                <form onSubmit={handleSaveProfile} className="premium-edit-grid">
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Email Address</label>
                                        <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Main Address</label>
                                        <textarea value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                                    </div>
                                    <button type="submit" className="p-action-btn primary">Save All Changes</button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="info-panel"
                                className="p-dashboard-card info-details-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="card-header-flex">
                                    <h3>Personal Details</h3>
                                </div>
                                <div className="details-interactive-list">
                                    <div className="detail-row">
                                        <div className="detail-icon"><Mail size={18} /></div>
                                        <div className="detail-text"><small>Email</small><p>{user.email}</p></div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-icon"><Phone size={18} /></div>
                                        <div className="detail-text"><small>Phone</small><p>{user.phone || "Not provided"}</p></div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-icon"><MapPin size={18} /></div>
                                        <div className="detail-text"><small>Primary Address</small><p>{user.address || "No address saved"}</p></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div 
                        className="p-dashboard-card orders-activity-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="card-header-flex">
                            <h3><ShoppingBag size={18} /> Recent Orders</h3>
                            {orders.length > 0 && <button className="text-btn">History</button>}
                        </div>

                        <div className="premium-order-track">
                            {orders.length === 0 ? (
                                <div className="empty-orders-state">
                                    <div className="empty-icon"><Clock size={40} /></div>
                                    <p>Your culinary journey starts here.</p>
                                    <button className="p-action-btn pill shadow" onClick={() => navigate('/products')}>Explore Meals</button>
                                </div>
                            ) : (
                                orders.slice(0, 3).map((order) => {
                                    const items = order.items || [];
                                    const firstItem = items[0] || {};
                                    return (
                                        <div 
                                            className="order-item-premium" 
                                            key={order.id}
                                            onClick={() => navigate(`/track/${order.id}`)}
                                        >
                                            <div className="order-visual">
                                                {firstItem.image ? (
                                                    <img src={firstItem.image} alt="order" />
                                                ) : (
                                                    <div className="order-placeholder">📦</div>
                                                )}
                                            </div>
                                            <div className="order-brief">
                                                <div className="order-name-flex">
                                                    <strong>{firstItem.name || "Order Pack"}</strong>
                                                    <span className={`status-pill ${order.status}`}>{order.status}</span>
                                                </div>
                                                <span className="order-meta-info">
                                                    {items.length > 1 ? `+ ${items.length - 1} other items` : 'Individual Pack'} • {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                {order.delivery_partner && (
                                                    <div className="delivery-track-info">
                                                        <span className={`partner-icn-small ${order.delivery_partner}`}>{order.delivery_partner}</span>
                                                        <span className="track-id">Track ID: #{order.tracking_id}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="order-val-final">₹{order.total_price}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

