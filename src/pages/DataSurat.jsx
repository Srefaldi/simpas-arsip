import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const API_URL = "https://script.google.com/macros/s/AKfycbydrpdtBLlx8_RWMH9w3E12onEi_mr_Im2HCehkxEe6KKQGgc2aEx40lq_iz2ID00PONQ/exec";

export default function DataSurat() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
const kategoriFilter = query.get("kategori");

  const jenis = location.pathname.includes("masuk")
    ? "SuratMasuk"
    : "SuratKeluar";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?jenis=${jenis}`);
      const result = await res.json();

      console.log("DATA:", result); // debug
      setData(result);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [jenis]);

  // DELETE
  const handleDelete = async (rowNumber) => {
    const confirm = await Swal.fire({
      title: "Hapus data?",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "delete",
          jenisSurat: jenis === "SuratMasuk" ? "Masuk" : "Keluar",
          rowNumber,
        }),
      });

      Swal.fire("Berhasil", "Data dihapus", "success");
      fetchData();
    }
  };

  const filteredData = kategoriFilter
  ? data.filter((i) => i.Kategori_Surat === kategoriFilter)
  : data;
  
  return (
  <DashboardLayout onRefresh={fetchData}>
    <div className="data-wrapper">

      <div className="data-header">

  <h2>
    Data {jenis === "SuratMasuk" ? "Surat Masuk" : "Surat Keluar"}
  </h2>

  <div className="header-action">

  {jenis === "SuratMasuk" ? (
    <button
      className="btn-tambah masuk"
      onClick={() => navigate("/surat-masuk")}
    >
      + Surat Masuk
    </button>
  ) : (
    <button
      className="btn-tambah keluar"
      onClick={() => navigate("/surat-keluar")}
    >
      + Surat Keluar
    </button>
  )}

</div>

</div>

      <div className="data-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nomor Surat</th>
              <th>Perihal</th>
              <th>Instansi</th>
              <th>Klasifikasi</th>
              {jenis === "SuratMasuk" && <th>Kategori</th>}
              <th style={{ textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty">
                  Loading data...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={jenis === "SuratMasuk" ? 7 : 6}
                  className="empty"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              filteredData.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>

                  <td className="nomor">
                    {item.Nomor_Surat || "-"}
                  </td>

                  <td>{item.Perihal}</td>

                  <td>
                    <span className="badge">
                      {item.Instansi}
                    </span>
                  </td>

                  <td>
                    <span className="badge">
                      {item.Klasifikasi}
                    </span>
                  </td>

                  {jenis === "SuratMasuk" && (
                  <td>
                    <span className="badge">
                      {item.Kategori_Surat || "-"}
                    </span>
                  </td>
                )}

                  <td>
                    <div className="aksi">

                      <button
                        className="btn-icon view"
                        onClick={() =>
                          navigate("/detail", { state: { data: item, jenis } })
                        }
                      >
                        👁
                      </button>

                      <button
                        className="btn-icon edit"
                        onClick={() =>
                          navigate("/edit", { state: { data: item, jenis } })
                        }
                      >
                        ✏️
                      </button>

                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(item.rowNumber)}
                      >
                        🗑
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  </DashboardLayout>
);
}