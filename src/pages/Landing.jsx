export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <h1>Sistem Arsip Surat Digital</h1>
        <p>Kelola surat masuk & keluar secara cepat, aman, dan terstruktur</p>
      </div>

      {/* WELCOME */}
      <div className="welcome">
        <h2>Selamat Datang Pegawai Bapas Kelas II Amuntai👋</h2>
        <p>
          Sistem ini digunakan untuk pengelolaan arsip surat masuk dan surat keluar
          secara digital di lingkungan kerja.
        </p>

        <div className="menu-card">
          <a href="/surat-masuk" className="card-menu">
            📥 Surat Masuk
          </a>

          <a href="/surat-keluar" className="card-menu">
            📤 Surat Keluar
          </a>

          <a href="/login" className="card-menu">
            🔐 Login Admin
          </a>
        </div>
      </div>
    </div>
  );
}