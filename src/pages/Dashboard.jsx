import React, { useState, useEffect } from "react";
import DataSurat from "../components/DataSurat";
import CONFIG from "../config";
import { Line } from "react-chartjs-2";
import Swal from "sweetalert2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = ({ setIsLogin }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [stats, setStats] = useState({ masuk: 0, keluar: 0 });
  const [isToggled, setIsToggled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    const savedMenu = localStorage.getItem("menu");
    if (savedMenu) setActiveMenu(savedMenu);
  }, []);

  useEffect(() => {
    localStorage.setItem("menu", activeMenu);
  }, [activeMenu]);
  const fetchStats = async () => {
    setIsRefreshing(true); // Mulai loading
    try {
      const [resMasuk, resKeluar] = await Promise.all([
        fetch(`${CONFIG.URL_GAS}?jenis=SuratMasuk`),
        fetch(`${CONFIG.URL_GAS}?jenis=SuratKeluar`),
      ]);
      const dataMasuk = await resMasuk.json();
      const dataKeluar = await resKeluar.json();
      setStats({
        masuk: Array.isArray(dataMasuk) ? dataMasuk.length : 0,
        keluar: Array.isArray(dataKeluar) ? dataKeluar.length : 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      // Simulasi delay sedikit agar animasi loading terlihat halus
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Surat Masuk",
        data: [
          stats.masuk,
          stats.masuk + 2,
          stats.masuk - 1,
          stats.masuk + 5,
          stats.masuk,
        ],
        borderColor: "#4e73df",
        tension: 0.3,
      },
      {
        label: "Surat Keluar",
        data: [
          stats.keluar,
          stats.keluar - 1,
          stats.keluar + 3,
          stats.keluar,
          stats.keluar + 2,
        ],
        borderColor: "#1cc88a",
        tension: 0.3,
      },
    ],
  };

  const menuKlasifikasi = ["BMN", "Tata Usaha", "BKA", "BKD", "PK"];

  return (
    <div id="wrapper">
      {/* ANIMASI LOADING OVERLAY */}
      {isRefreshing && (
        <div className="loading-overlay">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
          <h5 className="mt-3 text-primary font-weight-bold">
            Memperbarui Data...
          </h5>
        </div>
      )}

      {/* OVERLAY KLIK UNTUK TUTUP SIDEBAR DI MOBILE */}
      {isToggled && (
        <div
          className="content-overlay d-md-none"
          onClick={() => setIsToggled(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <ul
        className={`navbar-nav sidebar sidebar-dark accordion ${isToggled ? "toggled" : ""}`}
      >
        <div className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-folder-open"></i>
          </div>
          <div className="sidebar-brand-text mx-3">E-Arsip</div>
        </div>

        <hr className="sidebar-divider my-0" />
        <li className="nav-item mt-3">
          <button
            className={`nav-link ${activeMenu === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveMenu("dashboard");
              setIsToggled(false);
            }}
          >
            <i className="fas fa-fw fa-tachometer-alt"></i>{" "}
            <span>Dashboard</span>
          </button>
        </li>

        <hr className="sidebar-divider" />
        <div className="sidebar-heading text-white-50 small px-3 mb-2">
          Manajemen
        </div>

        <li className="nav-item">
          <button
            className={`nav-link ${activeMenu === "masuk" ? "active" : ""}`}
            onClick={() => {
              setActiveMenu("masuk");
              setIsToggled(false);
            }}
          >
            <i className="fas fa-fw fa-download"></i> <span>Surat Masuk</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeMenu === "keluar" ? "active" : ""}`}
            onClick={() => {
              setActiveMenu("keluar");
              setIsToggled(false);
            }}
          >
            <i className="fas fa-fw fa-upload"></i> <span>Surat Keluar</span>
          </button>
        </li>

        <hr className="sidebar-divider" />
        <div className="sidebar-heading text-white-50 small px-3 mb-2">
          Klasifikasi
        </div>

        {menuKlasifikasi.map((item) => (
          <li className="nav-item" key={item}>
            <button
              className={`nav-link ${activeMenu === item ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item);
                setIsToggled(false);
              }}
            >
              <i className="fas fa-fw fa-folder"></i> <span>{item}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* CONTENT */}
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <nav className="navbar navbar-expand navbar-light topbar mb-4 static-top shadow px-4 d-flex justify-content-between">
          <button
            className="btn btn-link border-0 text-primary"
            onClick={() => setIsToggled(!isToggled)}
          >
            <i className="fa fa-bars"></i>
          </button>

          <div className="d-flex align-items-center gap-2">
            {" "}
            {/* Class gap-2 ditambahkan */}
            <button
              className="btn btn-sm btn-light border text-primary shadow-sm"
              onClick={fetchStats}
            >
              <i className="fas fa-sync-alt mr-1"></i> Refresh
            </button>
            <button
              className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm"
              onClick={() => {
                localStorage.removeItem("isLogin");
                setIsLogin(false);
              }}
            >
              <i className="fas fa-sign-out-alt fa-sm mr-2"></i>Logout
            </button>
          </div>
        </nav>

        <div className="container-fluid animate__animated animate__fadeIn">
          <h1 className="h3 mb-4 text-gray-800 font-weight-bold">
            {activeMenu === "dashboard"
              ? "Overview Arsip"
              : `Data ${activeMenu}`}
          </h1>

          {activeMenu === "dashboard" && (
            <>
              <div className="row">
                <div className="col-xl-6 col-md-6 mb-4">
                  <div className="card card-stats border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center px-3">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Surat Masuk
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.masuk}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-inbox fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 mb-4">
                  <div className="card card-stats border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center px-3">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Surat Keluar
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.keluar}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-paper-plane fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">
                        Grafik Aktivitas
                      </h6>
                    </div>
                    <div className="card-body" style={{ height: "300px" }}>
                      <Line
                        data={chartData}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Render DataSurat untuk menu Masuk, Keluar, dan Klasifikasi */}
          {activeMenu !== "dashboard" && <DataSurat jenis={activeMenu} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
