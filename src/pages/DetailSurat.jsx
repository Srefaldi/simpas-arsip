import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function DetailSurat() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2 style={{ padding: 20 }}>Data tidak ditemukan</h2>;
  }

  const { data, jenis } = state;

  return (
    <DashboardLayout>
      <div className="detail-wrapper">
        <div className="detail-card">

          <h2 className="detail-title">
            Detail {jenis === "SuratMasuk"
              ? "Surat Masuk"
              : "Surat Keluar"}
          </h2>

          {/* NOMOR */}
          <div className="detail-item">
            <label>Nomor Surat</label>
            <p>{data.Nomor_Surat || "-"}</p>
          </div>

          {/* PERIHAL */}
          <div className="detail-item">
            <label>Perihal</label>
            <p>{data.Perihal || "-"}</p>
          </div>

          {/* INSTANSI */}
          <div className="detail-item">
            <label>Instansi</label>
            <p>{data.Instansi || "-"}</p>
          </div>

          {/* KLASIFIKASI */}
          <div className="detail-item">
            <label>Klasifikasi</label>
            <p>{data.Klasifikasi || "-"}</p>
          </div>

          {/* KATEGORI */}          
          <div className="detail-item">
            <label>Kategori Surat</label>
            <p>{data.Kategori_Surat || "-"}</p>
          </div>
          
          {/* FILE */}
          <div className="detail-item">
            <label>File Dokumen</label>

            {data.Link_File &&
            data.Link_File !== "-" &&
            data.Link_File.startsWith("http") ? (
              <a
                href={data.Link_File}
                target="_blank"
                rel="noreferrer"
                className="file-link"
              >
                Lihat File
              </a>
            ) : (
              <p>Tidak ada file</p>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate(-1)}
          >
            Kembali
          </button>

          </div>
        </div>
      </DashboardLayout>
  );
}