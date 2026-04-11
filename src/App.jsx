import React, { useState, useEffect } from "react";
import InputSurat from "./pages/InputSuratMasuk";
import DataSurat from "./pages/DataSurat";
import CONFIG from "./config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State untuk menyimpan statistik data
  const [stats, setStats] = useState({ masuk: 0, keluar: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  // Fungsi untuk mengambil jumlah data dari database
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      // Mengambil data surat masuk dan keluar secara bersamaan
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
    } catch (error) {
      console.error("Gagal mengambil statistik:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Jalankan fetchStats saat aplikasi dimuat atau saat menu dashboard dibuka
  useEffect(() => {
    fetchStats();
  }, [activeMenu]);

  const renderContent = () => {
    switch (activeMenu) {
      case "input":
        return <InputSurat />;
      case "masuk":
        return <DataSurat jenis="masuk" />;
      case "keluar":
        return <DataSurat jenis="keluar" />;
      default:
        return (
          <div className="container-fluid animate__animated animate__fadeIn">
            <div className="row mb-4">
              <div className="col">
                <h2 className="fw-bold">Ringkasan Arsip</h2>
                <p className="text-muted">
                  Data terbaru dari {CONFIG.INSTANSI}
                </p>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 p-4 border-start border-primary border-4 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1 text-uppercase small fw-bold">
                        Total Surat Masuk
                      </h6>
                      <h3 className="fw-bold mb-0">
                        {loadingStats ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          stats.masuk
                        )}
                      </h3>
                    </div>
                    <i className="bi bi-download fs-1 text-primary opacity-25"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 p-4 border-start border-success border-4 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1 text-uppercase small fw-bold">
                        Total Surat Keluar
                      </h6>
                      <h3 className="fw-bold mb-0">
                        {loadingStats ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          stats.keluar
                        )}
                      </h3>
                    </div>
                    <i className="bi bi-upload fs-1 text-success opacity-25"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="d-flex bg-light"
      style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      {/* SIDEBAR */}
      <div
        className={`bg-dark text-white transition-all shadow-lg ${isSidebarOpen ? "d-flex" : "d-none"} flex-column`}
        style={{ width: "260px", minWidth: "260px" }}
      >
        <div className="p-4 text-center border-bottom border-secondary">
          <h4 className="fw-bold mb-0 text-primary">
            <i className="bi bi-folder2-open me-2"></i>
            {CONFIG.APP_NAME}
          </h4>
        </div>
        <div className="flex-grow-1 p-3 overflow-auto">
          <nav className="nav nav-pills flex-column gap-2">
            <button
              className={`nav-link text-white py-3 border-0 text-start ${activeMenu === "dashboard" ? "active bg-primary shadow" : "hover-dark"}`}
              onClick={() => setActiveMenu("dashboard")}
            >
              <i className="bi bi-grid-1x2-fill me-3"></i>Dashboard
            </button>
            <div className="text-uppercase small fw-bold text-secondary mt-3 mb-2 px-3">
              Master Data
            </div>
            <button
              className={`nav-link text-white py-3 border-0 text-start ${activeMenu === "masuk" ? "active bg-primary shadow" : "hover-dark"}`}
              onClick={() => setActiveMenu("masuk")}
            >
              <i className="bi bi-inbox-fill me-3"></i>Surat Masuk
            </button>
            <button
              className={`nav-link text-white py-3 border-0 text-start ${activeMenu === "keluar" ? "active bg-primary shadow" : "hover-dark"}`}
              onClick={() => setActiveMenu("keluar")}
            >
              <i className="bi bi-send-fill me-3"></i>Surat Keluar
            </button>
            <div className="text-uppercase small fw-bold text-secondary mt-3 mb-2 px-3">
              Aksi
            </div>
            <button
              className={`nav-link text-white py-3 border-0 text-start ${activeMenu === "input" ? "active bg-primary shadow" : "hover-dark"}`}
              onClick={() => setActiveMenu("input")}
            >
              <i className="bi bi-plus-circle-fill me-3"></i>Input Surat Baru
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-4 py-3">
          <button
            className="btn btn-light border-0 me-3"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <span className="navbar-brand mb-0 h4 fw-bold text-secondary">
            {activeMenu.toUpperCase()}
          </span>
          <div className="ms-auto d-flex align-items-center">
            <div className="me-3 text-end d-none d-sm-block">
              <div className="fw-bold small">Admin {CONFIG.INSTANSI}</div>
              <div className="text-muted small" style={{ fontSize: "10px" }}>
                Administrator
              </div>
            </div>
            <div
              className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="bi bi-person"></i>
            </div>
          </div>
        </nav>
        <div className="flex-grow-1 overflow-auto p-3 p-md-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
