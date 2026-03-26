import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    Package, CheckCircle, Truck, 
    MapPin, ArrowLeft, ShieldCheck,
    ChefHat, Utensils
} from "lucide-react";
import "../styles/App.css";

const TrackOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // We'll use the existing /orders/me endpoint and filter or a new one
                const response = await axios.get("http://localhost:5000/orders/me", { withCredentials: true });
                const foundOrder = response.data.find(o => o.id === parseInt(id));
                setOrder(foundOrder);
            } catch (err) {
                console.error("Error fetching order details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (loading) return <div className="loading-screen">Locating your meal...</div>;
    if (!order) return <div className="loading-screen">Order not found</div>;

    const statuses = [
        { key: 'paid', label: 'Order Placed', icon: <Package size={20} />, description: 'Your order has been received' },
        { key: 'accepted', label: 'Accepted', icon: <CheckCircle size={20} />, description: 'Kitchen has accepted your order' },
        { key: 'preparing', label: 'Preparing', icon: <ChefHat size={20} />, description: 'Chefs are crafting your healthy meal' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={20} />, description: 'Your delivery partner is on the way' },
        { key: 'delivered', label: 'Delivered', icon: <Utensils size={20} />, description: 'Enjoy your delicious healthy meal!' }
    ];

    const currentStatusIndex = statuses.findIndex(s => s.key === order.status);
    const finalIndex = currentStatusIndex === -1 && order.status === 'pending' ? 0 : currentStatusIndex;

    return (
        <div className="track-order-page">
            <div className="track-container">
                <header className="track-header">
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1>Track Order #{order.id}</h1>
                    <div className="order-time">{new Date(order.created_at).toLocaleString()}</div>
                </header>

                <div className="track-grid">
                    <div className="track-main-card">
                        <div className="status-timeline">
                            {statuses.map((status, index) => {
                                const isCompleted = index <= finalIndex;
                                const isNext = index === finalIndex + 1;
                                return (
                                    <div key={status.key} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isNext ? 'next' : ''}`}>
                                        <div className="status-icon-box">
                                            {status.icon}
                                            {isCompleted && <div className="check-badge"><CheckCircle size={10} fill="#10b981" color="white" /></div>}
                                        </div>
                                        <div className="status-info">
                                            <h3>{status.label}</h3>
                                            <p>{status.description}</p>
                                        </div>
                                        {index < statuses.length - 1 && <div className="connector-line"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="track-sidebar">
                        <div className="track-card delivery-info">
                            <h3>Delivery Details</h3>
                            <div className="info-row">
                                <MapPin size={18} />
                                <div>
                                    <strong>Shipping Address</strong>
                                    <p>{order.shipping_address || "Home Address"}</p>
                                </div>
                            </div>
                            {order.delivery_partner && (
                                <div className="partner-info-box">
                                    <div className={`partner-tag ${order.delivery_partner}`}>
                                        {order.delivery_partner.toUpperCase()}
                                    </div>
                                    <div className="tracking-code">
                                        <span>Tracking ID</span>
                                        <strong>{order.tracking_id}</strong>
                                    </div>
                                    <button className="track-partner-btn">
                                        Open in {order.delivery_partner} app
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="track-card order-items-summary">
                            <h3>Order Summary</h3>
                            <div className="small-items-list">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="small-item">
                                        <img src={item.image} alt="" />
                                        <div className="details">
                                            <span>{item.name}</span>
                                            <strong>₹{order.total_price / order.items.length}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="price-footer">
                                <span>Total Paid</span>
                                <strong>₹{order.total_price}</strong>
                            </div>
                        </div>

                        <div className="track-card support-card">
                            <ShieldCheck size={24} color="#10b981" />
                            <div>
                                <strong>Need Help?</strong>
                                <p>Our 24/7 support is here for you.</p>
                            </div>
                            <button className="support-btn">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
