import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../components/layout/DashboardLayout";
import klasifikasi from "../data/data_klasifikasi.json";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwQzk-r9vNG0UsqeN-4GBVX7O61n-xO91AEtrHXRMRk94w_l0I-h7MMX_-_N7mV4dngQA/exec";

export default function EditSurat() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  if (!state) {
    return <h2 style={{ padding: 20 }}>Data tidak ditemukan</h2>;
  }

  const { data, jenis } = state;

  const [form, setForm] = useState({
    nomorSurat: data.Nomor_Surat || "",

    perihal: data.Perihal || "",

    instansi: data.Instansi || "",

    klasifikasi: data.Klasifikasi || "",

    kategoriSurat: data.Kategori_Surat || "",

    rowNumber: data.rowNumber,

    file: null,

    fileName: "",

    linkFile: data.Link_File || data.File || "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE FILE
  // =========================

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setForm({
        ...form,

        file: reader.result,

        fileName: file.name,
      });
    };
  };

  // =========================
  // UPDATE
  // =========================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch(API_URL, {
        method: "POST",

        mode: "no-cors",

        body: JSON.stringify({
          action: "update",

          jenisSurat: jenis === "SuratMasuk" ? "Masuk" : "Keluar",

          ...form,

          kategoriSurat: form.kategoriSurat,
        }),
      });

      setTimeout(
        async () => {
          setLoading(false);

          await Swal.fire("Berhasil", "Data berhasil diupdate", "success");

          navigate(jenis === "SuratMasuk" ? "/data/masuk" : "/data/keluar");
        },

        1000,
      );
    } catch (err) {
      console.log(err);

      setLoading(false);

      Swal.fire("Error", "Gagal update data", "error");
    }
  };

  return (
    <DashboardLayout>
      {/* =========================
          LOADING SCREEN
      ========================= */}

      {loading && (
        <div className="edit-loading">
          <div className="edit-loading-box">
            <div className="edit-spinner"></div>

            <h3>Mengupdate Data</h3>

            <p>Mohon tunggu sebentar...</p>
          </div>
        </div>
      )}

      <div className="edit-wrapper">
        <div className="edit-card">
          <h2 className="edit-title">
            Edit {jenis === "SuratMasuk" ? "Surat Masuk" : "Surat Keluar"}
          </h2>

          <form onSubmit={handleUpdate}>
            {/* NOMOR */}
            <label>Nomor Surat</label>

            <input
              name="nomorSurat"
              value={form.nomorSurat}
              onChange={handleChange}
            />

            {/* PERIHAL */}
            <label>Perihal</label>

            <input
              name="perihal"
              value={form.perihal}
              onChange={handleChange}
            />

            {/* INSTANSI */}
            <label>Instansi</label>

            <input
              name="instansi"
              value={form.instansi}
              onChange={handleChange}
            />

            {/* KLASIFIKASI */}
            <label>Klasifikasi</label>

            <select
              name="klasifikasi"
              value={form.klasifikasi}
              onChange={handleChange}
            >
              <option value="">Pilih Klasifikasi</option>

              {klasifikasi.map((item, i) => (
                <option key={i} value={item.kode}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>

            {/* KATEGORI */}
            {jenis === "SuratMasuk" && (
              <>
                <label>Kategori Surat</label>

                <select
                  name="kategoriSurat"
                  value={form.kategoriSurat}
                  onChange={handleChange}
                >
                  <option value="">Pilih Kategori</option>

                  <option value="PK">PK</option>

                  <option value="BKD">BKD</option>

                  <option value="BKA">BKA</option>

                  <option value="TU">TU</option>

                  <option value="Kepegawaian">Kepegawaian</option>

                  <option value="Keuangan">Keuangan</option>
                </select>
              </>
            )}

            {/* FILE LAMA */}
            <label>File Lama</label>

            {form.linkFile &&
            form.linkFile !== "-" &&
            form.linkFile.startsWith("http") ? (
              <a
                href={form.linkFile}
                target="_blank"
                rel="noreferrer"
                className="file-link"
              >
                Lihat File
              </a>
            ) : (
              <p className="no-file">Tidak ada file</p>
            )}

            {/* FILE BARU */}
            <label>Ganti File (Opsional)</label>

            <input type="file" onChange={handleFile} />

            {/* BUTTON */}
            <div className="btn-group">
              <button className="btn-primary">Update</button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
