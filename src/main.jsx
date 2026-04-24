import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Pastikan ini diimport paling bawah agar stylenya prioritas
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "admin-lte/dist/css/adminlte.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ✅ PENTING (BIAR ADMIN LTE MUNCUL)
document.body.className = "hold-transition sidebar-mini layout-fixed";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
