import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="footer-top">
                <div className="footer-brand-section">
                    <div className="footer-logo">
                        <span className="logo-text-pt1">Healthy</span>
                        <span className="logo-text-pt2"> Diet Food</span>
                    </div>
                    <p className="footer-tagline">
                        Your journey to a healthier lifestyle starts with what you eat.
                        We deliver nutrition-rich, chef-crafted meals right to your doorstep.
                    </p>
                    <div className="social-links-modern">
                        <a href="#" title="LinkedIn"><i className="fab fa-linkedin"></i></a>
                        <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" title="YouTube"><i className="fab fa-youtube"></i></a>
                        <a href="#" title="Facebook"><i className="fab fa-facebook"></i></a>
                    </div>
                </div>

                <div className="footer-links-grid">
                    <div className="footer-nav-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/products">Our Menu</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-nav-col">
                        <h4>For Partners</h4>
                        <ul>
                            <li><a href="#">Restaurants</a></li>
                            <li><a href="#">Delivery Heroes</a></li>
                            <li><a href="#">Corporate Sales</a></li>
                            <li><a href="#">Consulting</a></li>
                        </ul>
                    </div>
                    <div className="footer-nav-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-newsletter">
                    <h4>Stay Updated</h4>
                    <p>Subscribe for weekly diet tips and exclusive offers.</p>
                    <div className="newsletter-input">
                        <input type="email" placeholder="Enter your email" />
                        <button className="newsletter-btn">Join</button>
                    </div>
                    <div className="footer-badges">
                        <div className="badge-item">App Store</div>
                        <div className="badge-item">Play Store</div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom-bar">
                <p>&copy; 2026 Healthy Diet Food Delivery. Made with ❤️ for a healthier you.</p>
            </div>
        </footer>
    );
};

export default Footer;
