import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
  e.preventDefault();

  if (form.username === "admin" && form.password === "123") {

    // ✅ SIMPAN STATUS LOGIN
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("isAdmin", "true");

    Swal.fire({
      icon: "success",
      title: "Login Berhasil",
      text: "Selamat datang admin",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

  } else {
    Swal.fire({
      icon: "error",
      title: "Login Gagal",
      text: "Username atau password salah",
    });
  }
};

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login Admin</h2>
        <p className="sub">Silakan login untuk mengakses sistem</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Nama Pengguna"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Kata Sandi"
            onChange={handleChange}
            required
          />

          <button className="btn-primary full">Masuk</button>
        </form>

        <button
          className="btn-outline full"
          onClick={() => navigate("/")}
        >
          Batal
        </button>
      </div>
    </div>
  );
}