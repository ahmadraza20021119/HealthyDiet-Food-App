import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Zap, Truck, Utensils } from "lucide-react";
import "../styles/App.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') navigate("/admin");
      else navigate(localStorage.getItem("userInfoSubmitted") ? "/products" : "/userinfo");
    } else {
      navigate("/register-options");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="hero-container">
          <motion.div
            className="hero-text-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">✨ Rated #1 Diet Service 2026</span>
            <h1>Revolutionizing <br /><span className="gradient-text">Personal Nutrition</span></h1>
            <p>Ditch the generic diets. Get chef-prepared, nutritionist-approved meals tailored to your DNA and goals. Freshly delivered, always delicious.</p>

            <div className="hero-actions">
              <button className="cta-btn primary" onClick={handleGetStarted}>
                Start Your Journey <ArrowRight size={20} />
              </button>
              <button className="cta-btn secondary" onClick={() => navigate('/products')}>
                View Our Menu
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <strong>50k+</strong>
                <span>Active Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>4.9/5</strong>
                <span>Rating</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="main-plate-wrapper">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" alt="Healthy Plate" className="hero-main-img" />
              <motion.div
                className="float-card nutrition-card"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Zap size={16} color="#10b981" />
                <div>
                  <h6>High Protein</h6>
                  <span>35g per serving</span>
                </div>
              </motion.div>
              <motion.div
                className="float-card review-card"
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              >
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <div>
                  <h6>Highly Rated</h6>
                  <span>Verified User</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="modern-features">
        <motion.div className="section-intro" {...fadeInUp}>
          <h2>Why thousands choose <span className="gradient-text">HealthyDiet</span></h2>
          <p>We combine science with culinary art to bring you the best version of yourself.</p>
        </motion.div>

        <motion.div
          className="features-grid-modern"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {[
            { icon: <ShieldCheck color="#10b981" />, title: "Scientifically Backed", desc: "Every meal is calibrated for specific health goals and metabolic needs." },
            { icon: <Zap color="#10b981" />, title: "Performance Driven", desc: "Optimized macros to keep your energy levels peaking all day." },
            { icon: <Truck color="#10b981" />, title: "Climate Delivery", desc: "Freshness guaranteed with our proprietary cold-chain logistics." },
            { icon: <Utensils size={24} color="#10b981" />, title: "Chef Prepared", desc: "Restaurant quality taste with nutritionist-level accountability." }
          ].map((feature, i) => (
            <motion.div key={i} className="m-feature-card" variants={fadeInUp}>
              <div className="m-feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="visual-experience">
        <div className="experience-container">
          <motion.div className="exp-text" {...fadeInUp}>
            <h2>The <span className="gradient-text">Art of Healthy Living</span></h2>
            <p>Look at your food, then look at yourself. Both should be incredible.</p>
            <ul className="check-list">
              <li><ShieldCheck size={18} /> Organic Sourced Ingredients</li>
              <li><ShieldCheck size={18} /> No Added Preservatives</li>
              <li><ShieldCheck size={18} /> Daily Fresh Preparation</li>
            </ul>
          </motion.div>
          <div className="exp-visual-grid">
            <motion.img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
              alt="Bowl"
              whileHover={{ scale: 1.05 }}
              {...fadeInUp}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
              alt="Salad"
              whileHover={{ scale: 1.05 }}
              {...fadeInUp}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="modern-cta">
        <motion.div className="cta-gradient-box" {...fadeInUp}>
          <h2>Ready to upgrade your plate?</h2>
          <p>Join the movement of people who refuse to compromise on health or taste.</p>
          <button className="cta-btn light" onClick={handleGetStarted}>
            Start Your Free Trial
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
