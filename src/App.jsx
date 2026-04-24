import React, { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css"; // Tambahkan file CSS di bawah

function App() {
  const [page, setPage] = useState("landing");
  const [isLogin, setIsLogin] = useState(false);

  if (isLogin) {
    return <Dashboard setIsLogin={setIsLogin} />;
  }

  if (page === "login") {
    return <Login setIsLogin={setIsLogin} setPage={setPage} />;
  }

  return <Landing setPage={setPage} />;
}

export default App;
