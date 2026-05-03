import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoBapas from "../assets/logobapas.png";

const Login = ({ setIsLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123") {
      localStorage.setItem("isLogin", "true");
      setIsLogin(true);
      navigate("/dashboard");
    } else {
      alert("Username atau Password salah!");
    }
  };

  return (
    <div className="login-page-container">
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ maxWidth: "950px", width: "100%", minHeight: "500px" }}
      >
        <div className="row g-0 h-100">
          {/* KOLOM KIRI: Branding */}
          <div className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center p-5 branding-panel">
            {/* Perubahan di sini: Menggunakan padding untuk memberi ruang, dan width 100% pada gambar */}
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "white",
                position: "relative",
              }}
            >
              <img
                src={logoBapas}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: "67%",
                  left: "50%",
                  transform: "translate(-50%, -50%)", // 🔥 center PERFECT
                  width: "150%", // bisa naik/turun dikit kalau mau zoom
                  height: "140%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="text-center text-white">
              <h5 className="fw-bold mb-1">Sistem Arsip Surat</h5>
              <h4 className="fw-bolder">BAPAS KELAS II AMUNTAI</h4>
              <hr className="w-50 mx-auto opacity-50" />
              <p className="small opacity-75">Aplikasi sistem informasi.</p>
            </div>
          </div>

          {/* KOLOM KANAN: Form */}
          <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
            <div className="mb-4">
              <h3 className="fw-bold text-primary">MASUK ADMIN</h3>
              <p className="text-muted">
                Masukkan akun admin untuk mengakses sistem
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-0"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg bg-light border-0"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold shadow"
              >
                MASUK
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                className="btn btn-link btn-sm text-decoration-none text-muted"
                onClick={() => navigate("/")}
              >
                ← Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
