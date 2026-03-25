import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    LayoutDashboard, Package, ShoppingBag, Users,
    Plus, Gem, Pencil, Trash2, Search, LogOut, TrendingUp
} from "lucide-react";
import "../styles/App.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        health_goal: "weightLoss",
        dietary_preference: "vegan",
        calories: 0,
        protein: 0,
        carbs: 0
    });

    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchUsers();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin/orders", { withCredentials: true });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin/users", { withCredentials: true });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`http://localhost:5000/products/${editingProduct.id}`, formData);
            } else {
                await axios.post("http://localhost:5000/products", formData);
            }
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            alert("Error saving product. Please check console.");
            console.error(err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5000/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error("Error deleting", err);
            }
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/admin/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
            fetchOrders();
        } catch (err) {
            console.error("Error updating order status", err);
            alert("Failed to update status");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <>
                        <div className="admin-stats-grid">
                            <div className="stat-card blue">
                                <h3>Active Meals</h3>
                                <p>{products.length}</p>
                            </div>
                            <div className="stat-card green">
                                <h3>Total Volume</h3>
                                <p>₹{products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0).toLocaleString()}</p>
                            </div>
                            <div className="stat-card orange">
                                <h3>Total Orders</h3>
                                <p>{orders.length}</p>
                            </div>
                        </div>
                        <div className="admin-content-card">
                            <div className="table-header-box">
                                <h3>Recent Activity</h3>
                                <button className="btn-modern-outline" onClick={() => setActiveTab("products")}>View All</button>
                            </div>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Details</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><div className="product-info-cell">Order #102</div></td>
                                            <td>Sara Ahmed placed an order for ₹850</td>
                                            <td><span className="status-badge status-active">Pending</span></td>
                                        </tr>
                                        <tr>
                                            <td><div className="product-info-cell">New User</div></td>
                                            <td>John Doe joined the platform</td>
                                            <td><span className="status-badge status-active">Success</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
            case "products":
                return (
                    <div className="admin-content-card">
                        <div className="table-header-box" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <h3>Manage Inventory</h3>
                                <div className="search-box-modern">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search meals..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', padding: '8px', width: '200px' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Nutrition</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <img src={product.image} alt="" className="product-img-mini" />
                                                    <div>
                                                        <strong>{product.name}</strong>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{product.description?.substring(0, 40)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="status-badge status-active">{product.dietary_preference || "Standard"}</span></td>
                                            <td>₹{product.price}</td>
                                            <td>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                    {product.calories}kcal • {product.protein}g P • {product.carbs}g C
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="edit-btn-modern" onClick={() => handleEdit(product)}>
                                                        <Pencil size={16} strokeWidth={2.5} /> <span style={{ marginLeft: '6px', fontWeight: '700' }}>Edit</span>
                                                    </button>
                                                    <button className="delete-btn-modern" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 size={16} strokeWidth={2.5} /> <span style={{ marginLeft: '6px', fontWeight: '700' }}>Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "orders":
                return (
                    <div className="admin-content-card">
                        <div className="table-header-box">
                            <h3>Store Orders</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.user_name}</td>
                                            <td>₹{order.total_price}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status === 'delivered' ? 'active' : order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    className="admin-status-select"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "users":
                return (
                    <div className="admin-content-card">
                        <div className="table-header-box">
                            <h3>Platform Users</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td><strong>{user.name}</strong></td>
                                            <td>{user.email}</td>
                                            <td><span className="status-badge status-active">{user.role || 'user'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-layout">
            <div className="admin-sidebar">
                <div className="sidebar-title" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    <Gem size={20} color="#10b981" /> DIET ADMIN
                </div>
                <div className={`sidebar-link ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
                    <LayoutDashboard size={18} /> <span>Dashboard</span>
                </div>
                <div className={`sidebar-link ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
                    <Package size={18} /> <span>Products</span>
                </div>
                <div className={`sidebar-link ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
                    <ShoppingBag size={18} /> <span>Orders</span>
                </div>
                <div className={`sidebar-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                    <Users size={18} /> <span>Users</span>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <div className="sidebar-link" onClick={() => navigate("/")}>
                        <TrendingUp size={18} /> <span>View Site</span>
                    </div>
                    <div className="sidebar-link" onClick={handleLogout} style={{ color: '#ef4444' }}>
                        <LogOut size={18} /> <span>Logout admin</span>
                    </div>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-top-bar">
                    <div>
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Welcome back to your control center.</p>
                    </div>
                    {activeTab === "products" && (
                        <button className="btn-modern" onClick={() => { setEditingProduct(null); setFormData({ name: "", description: "", price: "", image: "", health_goal: "weightLoss", dietary_preference: "vegan", calories: 0, protein: 0, carbs: 0 }); setShowForm(true); }}>
                            <Plus size={16} /> Add New Meal
                        </button>
                    )}
                </div>

                {renderContent()}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingProduct ? "Edit Meal" : "Add New Meal"}</h3>
                            <button className="close-btn" onClick={() => setShowForm(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-grid-modern">
                                <div className="form-group-modern">
                                    <label>Meal Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Avocado Toast" />
                                </div>
                                <div className="form-group-modern">
                                    <label>Price (₹)</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-group-modern">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" />
                            </div>
                            <div className="form-group-modern">
                                <label>Image URL</label>
                                <input type="text" name="image" value={formData.image} onChange={handleInputChange} required />
                            </div>
                            <div className="form-grid-modern" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
                                <div className="form-group-modern">
                                    <label>Calories (kcal)</label>
                                    <input type="number" name="calories" value={formData.calories} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group-modern">
                                    <label>Protein (g)</label>
                                    <input type="number" name="protein" value={formData.protein} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group-modern">
                                    <label>Carbs (g)</label>
                                    <input type="number" name="carbs" value={formData.carbs} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-grid-modern">
                                <div className="form-group-modern">
                                    <label>Health Goal</label>
                                    <select name="health_goal" value={formData.health_goal} onChange={handleInputChange}>
                                        <option value="weightLoss">Weight Loss</option>
                                        <option value="weightGain">Weight Gain</option>
                                        <option value="muscleGain">Muscle Gain</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div className="form-group-modern">
                                    <label>Dietary Type</label>
                                    <select name="dietary_preference" value={formData.dietary_preference} onChange={handleInputChange}>
                                        <option value="vegan">Vegan</option>
                                        <option value="vegetarian">Vegetarian</option>
                                        <option value="nonVegetarian">Non-Vegetarian</option>
                                        <option value="keto">Keto</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button type="submit" className="btn-modern" style={{ flex: 2 }}>{editingProduct ? "Update Meal" : "Publish Meal"}</button>
                                <button type="button" className="btn-modern-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
