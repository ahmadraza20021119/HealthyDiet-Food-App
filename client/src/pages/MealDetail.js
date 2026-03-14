import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trash2, ShoppingBag, ArrowLeft, Star, Clock } from "lucide-react";
import "../styles/MealDetail.css";

const MealDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState("");
    const [cart, setCart] = useState([]);

    // Review states
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Editing states
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const addToCart = (e) => {
        const updatedCart = [...cart];
        const existingItem = updatedCart.find(item => item.id === product.id && item.instructions === instructions);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity: quantity, instructions: instructions });
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Confetti effect
        const rect = e.target.getBoundingClientRect();
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: rect.top / window.innerHeight, x: (rect.left + rect.width / 2) / window.innerWidth },
            colors: ['#10b981', '#3b82f6', '#fbbf24']
        });
    };

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewComment) return alert("Please add a comment");
        if (!currentUser.id) return alert("Please log in to leave a review");

        setSubmitting(true);
        try {
            const response = await axios.post(`http://localhost:5000/products/${id}/reviews`, {
                userId: currentUser.id,
                user: currentUser.name || "Valued Customer",
                rating: reviewRating,
                comment: reviewComment
            });
            setProduct(response.data);
            resetForm();
            confetti({
                particleCount: 50,
                spread: 120,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error("Review error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const response = await axios.delete(`http://localhost:5000/products/${id}/reviews/${reviewId}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const startEditing = (review) => {
        setEditingReviewId(review.id);
        setEditComment(review.comment);
        setEditRating(review.rating);
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/products/${id}/reviews/${editingReviewId}`, {
                comment: editComment,
                rating: editRating
            });
            setProduct(response.data);
            setEditingReviewId(null);
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const removeFromCart = () => {
        const updatedCart = cart.filter(item => item.id !== product.id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const resetForm = () => {
        setReviewComment("");
        setReviewRating(5);
    };

    if (loading) return <div className="loading-modern"><span></span></div>;
    if (!product) return <div className="error-modern">Meal not found.</div>;

    return (
        <motion.div
            className="meal-detail-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <button className="back-btn-modern" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
            </button>

            <div className="meal-content-grid">
                <motion.div
                    className="meal-image-section"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <img src={product.image} alt={product.name} className="meal-hero-img" />
                    <div className="meal-badge-floating">₹{product.price}</div>
                </motion.div>

                <motion.div
                    className="meal-info-section"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="premium-label">Chef's Choice</span>
                    <h1 className="meal-title-modern">{product.name}</h1>

                    <div className="rating-row-modern">
                        <div className="stars-modern">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}></i>
                            ))}
                        </div>
                        <span className="rating-count">({product.reviews_count} Verified Reviews)</span>
                    </div>

                    <div className="nutrition-pills">
                        <div className="n-pill"><span>{product.calories || 0}</span> kcal</div>
                        <div className="n-pill"><span>{product.protein || 0}g</span> Protein</div>
                        <div className="n-pill"><span>{product.carbs || 0}g</span> Carbs</div>
                    </div>

                    <p className="meal-desc-modern">{product.description}</p>

                    <div className="customization-options">
                        <label>Special Instructions (Optional)</label>
                        <textarea
                            placeholder="e.g. No onions, extra spicy, etc."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="instructions-input"
                        ></textarea>
                    </div>

                    <div className="quantity-bar">
                        <div className="qty-controls">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span className="qty-val">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        {cart.some(item => item.id === product.id) ? (
                            <button className="remove-from-cart-hero" onClick={removeFromCart}>
                                Remove from Cart
                            </button>
                        ) : (
                            <button className="add-to-cart-hero" onClick={addToCart}>
                                Add to Cart • ₹{product.price * quantity}
                            </button>
                        )}
                    </div>

                    <div className="tags-row">
                        {product.tags?.map((tag, i) => (
                            <span key={i} className="meal-tag-pill">#{tag}</span>
                        ))}
                    </div>
                </motion.div>
            </div>

            <section className="reviews-section-modern">
                <div className="review-header-main">
                    <h2>Community Feedback</h2>
                    <p>What others are saying about this {product.name}</p>
                </div>

                <div className="reviews-grid-modern">
                    <div className="review-form-card-modern">
                        <h3>{editingReviewId ? "Refine Review" : "Share Experience"}</h3>
                        {currentUser.id ? (
                            <form onSubmit={editingReviewId ? handleUpdateReview : handleReviewSubmit}>
                                {!editingReviewId && (
                                    <div className="user-indicator">
                                        <div className="u-avatar">{currentUser.name?.charAt(0)}</div>
                                        <span>Post as <strong>{currentUser.name}</strong></span>
                                    </div>
                                )}
                                <div className="form-group-modern">
                                    <label>Expert Rating</label>
                                    <div className="stars-input-aesthetic">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`fas fa-star ${(editingReviewId ? editRating : reviewRating) >= star ? 'active' : ''}`}
                                                onClick={() => editingReviewId ? setEditRating(star) : setReviewRating(star)}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group-modern">
                                    <textarea
                                        rows="4"
                                        placeholder="Detailed feedback..."
                                        value={editingReviewId ? editComment : reviewComment}
                                        onChange={(e) => editingReviewId ? setEditComment(e.target.value) : setReviewComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-actions-modern-sticky">
                                    <button type="submit" disabled={submitting} className="submit-rev-btn-modern">
                                        {editingReviewId ? "Save Changes" : "Post Review"}
                                    </button>
                                    {editingReviewId && (
                                        <button type="button" onClick={() => setEditingReviewId(null)} className="cancel-rev-btn">Cancel</button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="login-prompt-aesthetic">
                                <p>Join the community to leave a review.</p>
                                <button onClick={() => navigate('/login')}>Login Now</button>
                            </div>
                        )}
                    </div>

                    <div className="reviews-feed">
                        {product.reviews?.length > 0 ? (
                            product.reviews.map((rev, idx) => (
                                <motion.div
                                    key={idx}
                                    className="review-blob"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="blob-header">
                                        <div className="blob-user">
                                            <strong>{rev.user}</strong>
                                            <span>{rev.date}</span>
                                        </div>
                                        {currentUser && rev.userId === currentUser.id && (
                                            <div className="blob-tools">
                                                <button onClick={() => startEditing(rev)} className="btn-edit-blob"><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteReview(rev.id)} className="btn-del-blob"><i className="fas fa-trash"></i></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="blob-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star ${i < rev.rating ? 'active' : ''}`}></i>
                                        ))}
                                    </div>
                                    <p>"{rev.comment}"</p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="no-feedback-blob">No public feedback yet.</div>
                        )}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default MealDetail;
