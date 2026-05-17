import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyVXt_nByDd5CFEO-KNDFgLJp18f9ob0Z2iHjjSXm83H8mIGH3hKpMjIhvxS-gMYToTOQ/exec";

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

  const [currentPage, setCurrentPage] = useState(1);

  // SEARCH
  const [search, setSearch] = useState("");

  const dataPerPage = 10;

  // FETCH
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}?jenis=${jenis}`);

      const result = await res.json();

      console.log("DATA:", result);

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
      text: "Data yang dihapus tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      // LOADING SCREEN
      Swal.fire({
        title: "Menghapus Data...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,

        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await fetch(API_URL, {
          method: "POST",
          mode: "no-cors",

          body: JSON.stringify({
            action: "delete",
            jenisSurat: jenis === "SuratMasuk" ? "Masuk" : "Keluar",
            rowNumber,
          }),
        });

        // REFRESH DATA
        await fetchData();

        // SUCCESS
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.log(err);

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus data",
        });
      }
    }
  };

  // FILTER KATEGORI
  const kategoriData = kategoriFilter
    ? data.filter(
        (i) =>
          i.Kategori_Surat?.toString().trim().toLowerCase() ===
          kategoriFilter?.toString().trim().toLowerCase(),
      )
    : data;

  // SEARCH
  const filteredData = kategoriData.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      (item.Nomor_Surat || "").toString().toLowerCase().includes(keyword) ||
      (item.Perihal || "").toString().toLowerCase().includes(keyword) ||
      (item.Instansi || "").toString().toLowerCase().includes(keyword) ||
      (item.Kategori_Surat || "").toString().toLowerCase().includes(keyword)
    );
  });

  // PAGINATION
  const lastIndex = currentPage * dataPerPage;

  const firstIndex = lastIndex - dataPerPage;

  const currentData = filteredData.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [kategoriFilter, jenis, search]);

  return (
    <DashboardLayout onRefresh={fetchData}>
      <div className="data-wrapper">
        {/* HEADER */}
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

        {/* SEARCH */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Cari nomor surat, perihal, instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="data-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Instansi</th>

                {/* KHUSUS SURAT KELUAR */}
                {jenis === "SuratKeluar" && <th>Klasifikasi</th>}

                {/* KATEGORI KHUSUS SURAT MASUK */}
                {jenis === "SuratMasuk" && <th>Kategori</th>}

                <th
                  style={{
                    textAlign: "center",
                  }}
                >
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="empty"
                  >
                    Memuat Data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="empty"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                currentData.map((item, i) => (
                  <tr key={i}>
                    <td>{firstIndex + i + 1}</td>

                    <td className="nomor">
                      {item.Nomor_Surat || "-"}
                    </td>

                    <td>{item.Perihal || "-"}</td>

                    <td>
                      <span className="badge">
                        {item.Instansi || "-"}
                      </span>
                    </td>

                    {/* KHUSUS SURAT KELUAR */}
                    {jenis === "SuratKeluar" && (
                      <td>
                        <span className="badge">
                          {item.Klasifikasi || "-"}
                        </span>
                      </td>
                    )}

                    {/* KHUSUS SURAT MASUK */}
                    {jenis === "SuratMasuk" && (
                      <td>
                        <span className="badge">
                          {item.Kategori_Surat || "-"}
                        </span>
                      </td>
                    )}

                    <td>
                      <div className="aksi">

                        {/* DETAIL */}
                        <button
                          className="btn-icon view"
                          onClick={() =>
                            navigate("/detail", {
                              state: {
                                data: item,
                                jenis,
                              },
                            })
                          }
                        >
                          👁
                        </button>

                        {/* EDIT */}
                        <button
                          className="btn-icon edit"
                          onClick={() =>
                            navigate("/edit", {
                              state: {
                                data: item,
                                jenis,
                              },
                            })
                          }
                        >
                          ✏️
                        </button>

                        {/* DELETE */}
                        <button
                          className="btn-icon delete"
                          onClick={() =>
                            handleDelete(item.rowNumber)
                          }
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

          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Kembali
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Selanjutnya
            </button>
          </div>
        </div>

        <footer className="footer">
          © 2026 E-Arsip Balai Pemasyarakatan Kelas II Amuntai
        </footer>
      </div>
    </DashboardLayout>
  );
}
