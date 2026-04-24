import React, { useState } from "react";

const Login = ({ setIsLogin, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      setIsLogin(true);
    } else {
      alert("Login gagal!");
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center">
      <form
        onSubmit={handleLogin}
        className="card border-0 shadow-lg p-4 rounded-4"
        style={{ width: "380px" }}
      >
        <h4 className="fw-bold text-center mb-4">Login Admin</h4>

        <input
          type="text"
          placeholder="Username"
          className="form-control mb-3 py-2"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3 py-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100 py-2 fw-bold">Login</button>

        <button
          type="button"
          className="btn btn-link mt-2"
          onClick={() => setPage("landing")}
        >
          ← Kembali
        </button>
      </form>

      <style>{`
        .login-bg {
          height: 100vh;
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
        }
      `}</style>
    </div>
  );
};

export default Login;
