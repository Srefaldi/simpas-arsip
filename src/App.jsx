import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLogin, setIsLogin] = useState(null); // 🔥 bukan false lagi

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLogin");
    setIsLogin(loginStatus === "true");
  }, []);

  // 🔥 tahan render dulu sampai cek selesai
  if (isLogin === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />

      <Route
        path="/dashboard/*"
        element={
          isLogin ? (
            <Dashboard setIsLogin={setIsLogin} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
