import React from "react";
import { useNavigate } from "react-router-dom";
import InputSurat from "./InputSuratMasuk";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container">
          <span className="navbar-brand fw-bold text-primary">
            Arsip Digital
          </span>

          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => navigate("/login")}
          >
            Login Admin
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero-section text-white text-center d-flex align-items-center">
        <div className="container">
          <h1 className="fw-bold display-5">Sistem Arsip Surat Digital</h1>
          <p className="lead opacity-75">
            Kelola surat masuk & keluar secara cepat, aman, dan terstruktur
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="container py-5">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <InputSurat />
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          height: 300px;
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
        }
      `}</style>
    </div>
  );
};

export default Landing;
