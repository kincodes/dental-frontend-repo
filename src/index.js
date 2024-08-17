import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "react-router-dom";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthProvider";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
