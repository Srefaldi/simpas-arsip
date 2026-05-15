import Sidebar from "./Sidebar";
import { useState } from "react";
import { FaBars, FaTimes, FaSignOutAlt, FaSyncAlt } from "react-icons/fa";

import Swal from "sweetalert2";

export default function DashboardLayout({ children, onRefresh }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard">
      {/* MOBILE OVERLAY */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={open ? "sidebar mobile-open" : "sidebar"}>
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          {/* MOBILE TOGGLE */}
          <button className="mobile-toggle" onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>

          <button className="btn-refresh" onClick={onRefresh}>
            <FaSyncAlt /> Refresh
          </button>

          <button
            className="btn-logout"
            onClick={() => {
              Swal.fire({
                icon: "success",
                title: "Berhasil Logout",
                text: "Anda berhasil logout",
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                localStorage.removeItem("isLogin");
                localStorage.removeItem("isAdmin");

                window.location.href = "/login";
              });
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
