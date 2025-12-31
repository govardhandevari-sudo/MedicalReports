import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import DiagnosticDashboard from "./diagnostic-dashboard";
import App from "./App";
const container = document.getElementById("root");
import "./index.css";

if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
