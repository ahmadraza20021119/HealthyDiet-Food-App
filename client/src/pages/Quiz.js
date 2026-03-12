import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Ruler, Weight, Activity } from "lucide-react";
import "../styles/Quiz.css";

const steps = [
    {
        id: "basics",
        title: "The Basics",
        subtitle: "Let's start with who you are.",
        fields: ["name", "age", "gender"]
    },
    {
        id: "vitals",
        title: "Body Vitals",
        subtitle: "Precision matters for your metabolic rate.",
        fields: ["weight", "height"]
    },
    {
        id: "lifestyle",
        title: "Lifestyle",
        subtitle: "How active is your daily routine?",
        fields: ["activityLevel"]
    },
    {
        id: "goals",
        title: "Your Mission",
        subtitle: "What are we aiming for?",
        fields: ["healthGoal", "dietaryPreference"]
    }
];

const Quiz = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        weight: "",
        height: "",
        activityLevel: "",
        healthGoal: "",
        dietaryPreference: "",
        allergies: "",
        foodIntake: "",
    });

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        try {
            await fetch("http://localhost:5000/api/userinfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            localStorage.setItem("userInfoSubmitted", "true");
            localStorage.setItem("userInfo", JSON.stringify(formData));

            // Trigger success animation then redirect
            setCurrentStep(steps.length); // Success state
            setTimeout(() => navigate("/products"), 2000);
        } catch (error) {
            console.error("Quiz error:", error);
            alert("Submission failed. Please try again.");
        }
    };

    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                {currentStep < steps.length ? (
                    <>
                        <div className="quiz-progress-wrapper">
                            <div className="progress-bar-bg">
                                <motion.div
                                    className="progress-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <span>Step {currentStep + 1} of {steps.length}</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="quiz-step-content"
                            >
                                <div className="step-header">
                                    <h2>{steps[currentStep].title}</h2>
                                    <p>{steps[currentStep].subtitle}</p>
                                </div>

                                <div className="quiz-fields">
                                    {steps[currentStep].id === "basics" && (
                                        <>
                                            <div className="input-group">
                                                <label>Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                />
                                            </div>
                                            <div className="input-row">
                                                <div className="input-group">
                                                    <label>Age</label>
                                                    <input
                                                        type="number"
                                                        placeholder="24"
                                                        value={formData.age}
                                                        onChange={(e) => handleChange("age", e.target.value)}
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label>Gender</label>
                                                    <select value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                                                        <option value="">Select</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {steps[currentStep].id === "vitals" && (
                                        <div className="vitals-grid">
                                            <div className="choice-card-input">
                                                <Weight size={24} />
                                                <input
                                                    type="number"
                                                    placeholder="Weight (kg)"
                                                    value={formData.weight}
                                                    onChange={(e) => handleChange("weight", e.target.value)}
                                                />
                                            </div>
                                            <div className="choice-card-input">
                                                <Ruler size={24} />
                                                <input
                                                    type="number"
                                                    placeholder="Height (cm)"
                                                    value={formData.height}
                                                    onChange={(e) => handleChange("height", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {steps[currentStep].id === "lifestyle" && (
                                        <div className="options-grid">
                                            {[
                                                { id: "sedentary", label: "Sedentary", desc: "Office desk, no exercise" },
                                                { id: "moderate", label: "Moderate", desc: "Active daily life, gym 3x" },
                                                { id: "active", label: "Athlete", desc: "Hard daily training" }
                                            ].map((opt) => (
                                                <div
                                                    key={opt.id}
                                                    className={`option-card ${formData.activityLevel === opt.id ? 'active' : ''}`}
                                                    onClick={() => handleChange("activityLevel", opt.id)}
                                                >
                                                    <Activity size={20} />
                                                    <div className="opt-text">
                                                        <strong>{opt.label}</strong>
                                                        <span>{opt.desc}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {steps[currentStep].id === "goals" && (
                                        <div className="goals-section">
                                            <label>Select Your Priority</label>
                                            <div className="pill-selector">
                                                {["weightLoss", "muscleGain", "maintenance"].map((goal) => (
                                                    <button
                                                        key={goal}
                                                        className={formData.healthGoal === goal ? 'active' : ''}
                                                        onClick={() => handleChange("healthGoal", goal)}
                                                    >
                                                        {goal.replace(/([A-Z])/g, ' $1').trim()}
                                                    </button>
                                                ))}
                                            </div>

                                            <label>Dietary Baseline</label>
                                            <div className="pill-selector">
                                                {["vegetarian", "nonVegetarian", "keto", "vegan"].map((diet) => (
                                                    <button
                                                        key={diet}
                                                        className={formData.dietaryPreference === diet ? 'active' : ''}
                                                        onClick={() => handleChange("dietaryPreference", diet)}
                                                    >
                                                        {diet.charAt(0).toUpperCase() + diet.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="quiz-actions">
                                    <button
                                        className={`quiz-btn secondary ${currentStep === 0 ? 'invisible' : ''}`}
                                        onClick={handleBack}
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button
                                        className="quiz-btn primary"
                                        onClick={handleNext}
                                        disabled={!steps[currentStep].fields.every(f => formData[f])}
                                    >
                                        {currentStep === steps.length - 1 ? "Get My Plan" : "Continue"} <ArrowRight size={18} />
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
                        <CheckCircle2 size={80} color="#10b981" />
                        <h2>Generating Your Plan...</h2>
                        <p>Our AI is crafting the perfect menu based on your profile.</p>
                        <div className="loader-line"></div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
