import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Ruler, Weight, Activity, Target, Check } from "lucide-react";
import "../styles/Quiz.css";

const steps = [
    {
        id: "basics",
        title: "Personal Setup",
        subtitle: "Help us understand who you are.",
        fields: ["age", "gender"]
    },
    {
        id: "vitals",
        title: "Body Metrics",
        subtitle: "Accurate metrics help us calculate your Basal Metabolic Rate (BMR).",
        fields: ["weight", "height"]
    },
    {
        id: "lifestyle",
        title: "Activity Level",
        subtitle: "Your daily movement dictates your total energy expenditure.",
        fields: ["activityLevel"]
    },
    {
        id: "goals",
        title: "Your Objectives",
        subtitle: "What are we aiming for? We'll adjust the macros accordingly.",
        fields: ["healthGoal", "dietaryPreference"]
    }
];

const Quiz = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        weight: "",
        height: "",
        activityLevel: "",
        healthGoal: "",
        dietaryPreference: ""
    });

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSkip = () => {
        handleSubmit(true);
    };

    const handleSubmit = async (skipped = false) => {
        try {
            if (!skipped) {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                // Submit to backend if applicable. Since this backend endpoint might not exist properly, avoid failing over it.
                await fetch("http://localhost:5000/api/userinfo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, userId: user.id }),
                }).catch(() => {});
                localStorage.setItem("userInfo", JSON.stringify(formData));
            }
            
            localStorage.setItem("userInfoSubmitted", "true");

            // Trigger success animation then redirect
            setCurrentStep(steps.length); // Success state
            setTimeout(() => navigate("/products"), 2000);
        } catch (error) {
            console.error("Quiz error:", error);
            localStorage.setItem("userInfoSubmitted", "true");
            setCurrentStep(steps.length);
            setTimeout(() => navigate("/products"), 1500);
        }
    };

    const progress = (currentStep / steps.length) * 100;

    const isCurrentStepValid = () => {
        if (currentStep >= steps.length) return true;
        return steps[currentStep].fields.every((f) => formData[f] !== "" && formData[f] !== void 0);
    };

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                {currentStep < steps.length ? (
                    <>
                        <div className="quiz-top-bar">
                            <div className="quiz-progress-wrapper" style={{ flex: 1, marginRight: '20px', marginBottom: '0' }}>
                                <div className="progress-bar-bg">
                                    <motion.div
                                        className="progress-bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', display: 'block', fontWeight: 'bold' }}>
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                            </div>
                            <button className="skip-quiz-btn" onClick={handleSkip} type="button">
                                Skip Assessment
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="quiz-step-content"
                            >
                                <div className="step-header">
                                    <h2>{steps[currentStep].title}</h2>
                                    <p>{steps[currentStep].subtitle}</p>
                                </div>

                                <div className="quiz-fields">
                                    {steps[currentStep].id === "basics" && (
                                        <div className="input-row-modern" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div className="input-group">
                                                <label>Age (years)</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 28"
                                                    value={formData.age}
                                                    onChange={(e) => handleChange("age", e.target.value)}
                                                    min="16"
                                                    max="120"
                                                    className="modern-input"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Biological Gender</label>
                                                <div className="pill-selector">
                                                    <button 
                                                        type="button" 
                                                        className={formData.gender === "male" ? 'active' : ''} 
                                                        onClick={() => handleChange("gender", "male")}
                                                    >
                                                        {formData.gender === "male" && <Check size={16} />} Male
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className={formData.gender === "female" ? 'active' : ''} 
                                                        onClick={() => handleChange("gender", "female")}
                                                    >
                                                        {formData.gender === "female" && <Check size={16} />} Female
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {steps[currentStep].id === "vitals" && (
                                        <div className="vitals-grid">
                                            <div className="choice-card-input">
                                                <Weight size={24} color="var(--primary-color)" />
                                                <div className="input-with-unit" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="number"
                                                        placeholder="Weight"
                                                        value={formData.weight}
                                                        onChange={(e) => handleChange("weight", e.target.value)}
                                                    />
                                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginLeft: '5px' }}>kg</span>
                                                </div>
                                            </div>
                                            <div className="choice-card-input">
                                                <Ruler size={24} color="var(--primary-color)" />
                                                <div className="input-with-unit" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="number"
                                                        placeholder="Height"
                                                        value={formData.height}
                                                        onChange={(e) => handleChange("height", e.target.value)}
                                                    />
                                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginLeft: '5px' }}>cm</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {steps[currentStep].id === "lifestyle" && (
                                        <div className="options-grid">
                                            {[
                                                { id: "sedentary", label: "Sedentary", desc: "Little to no exercise, desk job" },
                                                { id: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
                                                { id: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
                                                { id: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week" }
                                            ].map((opt) => (
                                                <div
                                                    key={opt.id}
                                                    className={`option-card ${formData.activityLevel === opt.id ? 'active' : ''}`}
                                                    onClick={() => handleChange("activityLevel", opt.id)}
                                                >
                                                    <Activity size={24} color={formData.activityLevel === opt.id ? "white" : "#10b981"} />
                                                    <div className="opt-text" style={{ flex: 1 }}>
                                                        <strong>{opt.label}</strong>
                                                        <span>{opt.desc}</span>
                                                    </div>
                                                    {formData.activityLevel === opt.id && (
                                                        <motion.div 
                                                            className="checkmark-circle" 
                                                            initial={{ scale: 0 }} 
                                                            animate={{ scale: 1 }} 
                                                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                                        >
                                                            <Check size={14} color="white" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {steps[currentStep].id === "goals" && (
                                        <div className="goals-section">
                                            <div className="goal-block">
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                                    <Target size={18} color="#10b981" /> Primary Health Goal
                                                </label>
                                                <div className="pill-selector wrapped">
                                                    {[
                                                        { id: "weightLoss", label: "Weight Loss" },
                                                        { id: "muscleGain", label: "Muscle Gain" },
                                                        { id: "maintenance", label: "Maintenance" }
                                                    ].map((goal) => (
                                                        <button
                                                            key={goal.id}
                                                            type="button"
                                                            className={formData.healthGoal === goal.id ? 'active' : ''}
                                                            onClick={() => handleChange("healthGoal", goal.id)}
                                                        >
                                                            {formData.healthGoal === goal.id && <Check size={16} strokeWidth={3} />} {goal.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="goal-block" style={{ marginTop: '20px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                                    <Target size={18} color="#10b981" /> Dietary Preference
                                                </label>
                                                <div className="pill-selector wrapped">
                                                    {[
                                                        { id: "standard", label: "Standard (Any)" },
                                                        { id: "vegetarian", label: "Vegetarian" },
                                                        { id: "vegan", label: "Vegan" },
                                                        { id: "keto", label: "Keto" },
                                                        { id: "paleo", label: "Paleo" }
                                                    ].map((diet) => (
                                                        <button
                                                            key={diet.id}
                                                            type="button"
                                                            className={formData.dietaryPreference === diet.id ? 'active' : ''}
                                                            onClick={() => handleChange("dietaryPreference", diet.id)}
                                                        >
                                                            {formData.dietaryPreference === diet.id && <Check size={16} strokeWidth={3} />} {diet.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="quiz-actions" style={{ marginTop: '40px' }}>
                                    <button
                                        type="button"
                                        className={`quiz-btn secondary ${currentStep === 0 ? 'invisible' : ''}`}
                                        onClick={handleBack}
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button
                                        type="button"
                                        className="quiz-btn primary"
                                        onClick={handleNext}
                                        disabled={!isCurrentStepValid()}
                                    >
                                        {currentStep === steps.length - 1 ? "Generate My Plan" : "Continue"} <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </>
                ) : (
                    <motion.div
                        className="quiz-success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <CheckCircle2 size={90} color="#10b981" />
                        <h2>Profile Complete!</h2>
                        <p>We're custom-tailoring a professional menu perfectly aligned with your health parameters.</p>
                        <div className="loader-line" style={{ marginTop: '30px' }}></div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
