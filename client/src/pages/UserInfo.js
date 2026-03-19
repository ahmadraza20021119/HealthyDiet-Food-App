import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const UserInfo = () => {
  const navigate = useNavigate();
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

  React.useEffect(() => {
    const savedInfo = localStorage.getItem("userInfo");
    if (savedInfo) {
      setFormData(JSON.parse(savedInfo));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/userinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to submit user info";
        throw new Error(errorMessage);
      }

      console.log("Submitted user info:", formData);
      localStorage.setItem("userInfoSubmitted", "true");
      localStorage.setItem("userInfo", JSON.stringify(formData));
      navigate("/products");
    } catch (error) {
      console.error("Error submitting user info:", error.message);
      alert("There was a problem submitting your data: " + error.message);
    }
  }; // <--- Closing brace here

  return (
    <div className="user-info-page">
      <h2>Tell Us About Yourself</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          required
        />

        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Activity Level</option>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Light (light exercise 1-3 days/week)</option>
          <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
          <option value="active">Active (hard exercise 6-7 days/week)</option>
          <option value="veryActive">Very Active (hard daily training or physical job)</option>
        </select>

        <select
          name="healthGoal"
          value={formData.healthGoal}
          onChange={handleChange}
          required
        >
          <option value="">Your Health Goal</option>
          <option value="weightLoss">Weight Loss</option>
          <option value="weightGain">Weight Gain</option>
          <option value="muscleGain">Muscle Gain</option>
          <option value="maintenance">Maintain Current Shape</option>
        </select>

        <select
          name="dietaryPreference"
          value={formData.dietaryPreference}
          onChange={handleChange}
          required
        >
          <option value="">Dietary Preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="nonVegetarian">Non-Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>

        <input
          type="text"
          name="allergies"
          placeholder="Food Allergies (if any)"
          value={formData.allergies}
          onChange={handleChange}
        />

        <textarea
          name="foodIntake"
          rows="4"
          placeholder="Describe your current daily food intake"
          value={formData.foodIntake}
          onChange={handleChange}
          required
        />

        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 2 }}>
            {localStorage.getItem("userInfoSubmitted") ? "Update Profile" : "Continue to Diet Recommendations"}
          </button>
          {!localStorage.getItem("userInfoSubmitted") && (
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem("userInfoSubmitted", "true");
                navigate("/products");
              }}
              style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Skip for now
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
