# HealthyDiet - Diet & Food App 🥗

HealthyDiet is a premium, full-stack web application designed to help users manage their diet, explore healthy food options, and track their nutritional goals. With a sleek user interface and a robust backend, it provides a seamless experience for both users and administrators.

## ✨ Features

- **Personalized Meal Planning**: Tailored food recommendations based on user profiles.
- **Dynamic Product Catalog**: Browse a wide range of healthy food products with detailed nutritional information.
- **Interactive Quiz**: Discover the best diet plan for your lifestyle through an engaging assessment.
- **Smart Shopping Cart**: Easy-to-use cart system with persistent state management.
- **Admin Dashboard**: Comprehensive management tools for products, users, and orders.
- **Premium UI/UX**: Modern, responsive design with smooth animations using Framer Motion and Lucide icons.
- **AI Integration**: Intelligent features to assist in meal selection and nutritional advice.

## 🚀 Tech Stack

### Frontend
- **React.js**: Modern component-based UI.
- **React Router**: Seamless page navigation.
- **Framer Motion**: Smooth, high-end animations.
- **Lucide React**: Clean and consistent iconography.
- **Bootstrap**: Responsive layout framework.

### Backend
- **Node.js**: Scalable server-side logic.
- **Express.js**: Lightweight web framework for building APIs.
- **MySQL**: Relational database for structured data storage (Users, Orders, Products).

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL Server

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/diet-food-app.git
cd diet-food-app
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables. Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=nutriplan_db
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```

## 📂 Project Structure

```bash
diet-food-app/
├── client/              # React frontend
│   ├── public/          # Static assets
│   └── src/             # Frontend source code
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page views (Home, Dashboard, etc.)
│       └── styles/      # CSS & Design system
├── server/              # Express backend
│   ├── config/          # Database configuration
│   ├── routes/          # API endpoints
│   └── server.js        # Main entry point
└── docs/                # Documentation & diagrams
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for a healthier lifestyle.
