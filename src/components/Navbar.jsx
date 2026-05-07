import { Link } from "react-router-dom";

export default function Navbar() {
  const isLogin = localStorage.getItem("isLogin");

  return (
    <div className="nav">
      <h2>E-Arsip</h2>

      <div className="nav-menu">
        <Link to="/surat-masuk">Surat Masuk</Link>
        <Link to="/surat-keluar">Surat Keluar</Link>

        {isLogin ? (
          <Link to="/dashboard">
            <button className="btn-primary">Admin</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="btn-primary">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
}