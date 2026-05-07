import Sidebar from "./Sidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaSignOutAlt, FaSyncAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function DashboardLayout({ children, onRefresh }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <div className="topbar">
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

        <div className="content">{children}</div>
      </div>
    </div>
  );
}