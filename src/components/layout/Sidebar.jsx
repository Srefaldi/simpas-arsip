import { Link, useLocation } from "react-router-dom";
import { FaHome, FaInbox, FaPaperPlane } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Surat Masuk", path: "/data/masuk", icon: <FaInbox /> },
    { name: "Surat Keluar", path: "/data/keluar", icon: <FaPaperPlane /> },
  ];

  const kategoriMenu = [
  { name: "PK", path: "/data/masuk?kategori=PK" },
  { name: "BKD", path: "/data/masuk?kategori=BKD" },
  { name: "BKA", path: "/data/masuk?kategori=BKA" },
  { name: "TU", path: "/data/masuk?kategori=TU" },
];

  return (
    <div className="sidebar">
      <div className="logo-box">
        <div className="logo-bg">
    <img src="/kemenimipas.png" alt="kemenimipas" />
    <img src="/bapas.png" alt="bapas" />
  </div>
    <h3>E-Arsip</h3>
  </div>

      <div className="menu">
        {menu.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={
              location.pathname === item.path ? "menu-item active" : "menu-item"
            }
          >
            <span className="icon">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>

      <div className="kategori-box">
        <p className="kategori-title">Kategori Surat</p>

        {kategoriMenu.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={
              location.pathname + location.search === item.path
                ? "menu-item small active"
                : "menu-item small"
            }
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}