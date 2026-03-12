import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, ShoppingBag, ChevronRight, PieChart, Activity } from "lucide-react";
import "../styles/App.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: "", email: "", phone: "", address: "" });
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/orders/me", { withCredentials: true });
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
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

    if (!user) return <div className="loading-screen">Loading...</div>;

    const macros = {
        protein: userInfo.healthGoal === "muscleGain" ? 85 : 60,
        carbs: userInfo.healthGoal === "weightLoss" ? 40 : 70,
        fats: 55
    };

    return (
        <div className="profile-modern-container">
            <div className="profile-header-grid">
                <motion.div
                    className="profile-main-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="p-avatar-wrapper">
                        <div className="p-avatar-large">{user.name?.charAt(0)}</div>
                        <div className="p-status-ring"></div>
                    </div>
                    <div className="p-text-meta">
                        <h1>{user.name}</h1>
                        <span className="p-role-pill">{user.role || "Elite Member"}</span>
                    </div>
                </motion.div>

                <div className="p-actions-top">
                    <button className="p-btn-edit" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>
            </div>

            <div className="profile-body-grid">
                {/* Analytics Section */}
                <motion.div
                    className="p-card analytics-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-top">
                        <PieChart size={20} color="#10b981" />
                        <h3>Daily Target</h3>
                    </div>
                    <div className="macro-stats">
                        <div className="macro-item">
                            <div className="macro-label">
                                <span>Protein</span>
                                <strong>{macros.protein}%</strong>
                            </div>
                            <div className="macro-bar"><motion.div className="bar-fill p" initial={{ width: 0 }} animate={{ width: `${macros.protein}%` }} /></div>
                        </div>
                        <div className="macro-item">
                            <div className="macro-label">
                                <span>Carbs</span>
                                <strong>{macros.carbs}%</strong>
                            </div>
                            <div className="macro-bar"><motion.div className="bar-fill c" initial={{ width: 0 }} animate={{ width: `${macros.carbs}%` }} /></div>
                        </div>
                        <div className="macro-item">
                            <div className="macro-label">
                                <span>Fats</span>
                                <strong>{macros.fats}%</strong>
                            </div>
                            <div className="macro-bar"><motion.div className="bar-fill f" initial={{ width: 0 }} animate={{ width: `${macros.fats}%` }} /></div>
                        </div>
                    </div>
                    <div className="goal-summary">
                        <Activity size={16} />
                        <span>Current Focus: <strong>{userInfo.healthGoal?.replace(/([A-Z])/g, ' $1') || "General Health"}</strong></span>
                    </div>
                    <button className="update-quiz-btn" onClick={() => navigate('/userinfo')}>Update Health Profile</button>
                </motion.div>

                {/* Personal Info */}
                <motion.div
                    className="p-card info-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-top">
                        <User size={20} color="#3b82f6" />
                        <h3>Personal Details</h3>
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="p-edit-form">
                            <input name="name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                            <input name="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                            <input name="phone" placeholder="Phone" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                            <button type="submit" className="save-btn-p">Save Info</button>
                        </form>
                    ) : (
                        <div className="p-info-list">
                            <div className="p-info-item">
                                <Mail size={16} />
                                <div><small>Email</small><p>{user.email}</p></div>
                            </div>
                            <div className="p-info-item">
                                <Phone size={16} />
                                <div><small>Phone</small><p>{user.phone || "Add number"}</p></div>
                            </div>
                            <div className="p-info-item">
                                <MapPin size={16} />
                                <div><small>Address</small><p>{user.address || "Add address"}</p></div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Orders Section */}
                <motion.div
                    className="p-card orders-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-top">
                        <ShoppingBag size={20} color="#f59e0b" />
                        <h3>Recent Orders</h3>
                    </div>
                    <div className="p-order-list">
                        {orders.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', margin: '20px 0' }}>No orders placed yet.</p>
                        ) : (
                            orders.map(order => {
                                const items = order.items || [];
                                const firstItem = items[0] || {};
                                return (
                                    <div className="p-order-row" key={order.id}>
                                        <div className="order-img-placeholder" style={{
                                            backgroundImage: `url(${firstItem.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            textIndent: '-9999px' // Hide fallback text if image is active
                                        }}>
                                            {firstItem.name?.charAt(0) || "📦"}
                                        </div>
                                        <div className="order-details">
                                            <strong>{items.length > 1 ? `${firstItem.name} + ${items.length - 1} more` : firstItem.name || `Order #${order.id}`}</strong>
                                            <span style={{ textTransform: 'capitalize' }}>{order.status} • {new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="order-price">₹{order.total_price}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {orders.length > 0 && <button className="p-btn-all">View All Orders <ChevronRight size={16} /></button>}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
