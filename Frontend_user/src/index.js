import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import LoginPage from "./LoginPage";
import reportWebVitals from "./reportWebVitals";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <head>
        
		    <link rel="shortcut icon" href="/img/logo.png" type="image/x-icon"></link>
        <title>XPoint</title>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
        <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous"></script>
        <script src="https://app.embed.im/whatsapp.js" data-phone="" data-theme="1" defer></script>
        
      </head>
    <div>
        <BrowserRouter>
        <App />
      </BrowserRouter>,
      {/* document.getElementById('root') */}
  </div>
  </>
);

reportWebVitals();
