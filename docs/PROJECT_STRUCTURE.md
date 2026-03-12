# Diet Food App Project Structure

## 🟢 Backend (server/)
- **config/**: Database configuration and connection pools.
- **routes/**: API route handlers (Auth, Products, AI, Users).
- **scripts/**: Migration scripts, seeding data, and utility tools.
- **docs/**: Project documentation and logs.
- **server.js**: Main entry point for the Express server.

## 🔵 Frontend (client/)
- **src/components/**: Reusable UI components (Navbar, Footer, Chatbot).
- **src/pages/**: Main page components linked to routes.
- **src/styles/**: Centralized CSS for both global and component-specific styles.
- **src/utils/**: Helper functions and services.

## 🛠️ Key Scripts
`npm run dev`: Start the server with automatic reload.
`npm run seed`: Populate the database with initial meal and admin data.
