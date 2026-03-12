import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";

axios.defaults.withCredentials = true;
// import ErrorBoundary from './components/ErrorBoundary'; // Optional

if (process.env.NODE_ENV === 'development') {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
