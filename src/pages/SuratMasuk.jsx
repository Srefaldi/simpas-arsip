// =========================
// SURAT MASUK
// =========================

import { useState } from "react";
import klasifikasi from "../data/data_klasifikasi.json";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwQzk-r9vNG0UsqeN-4GBVX7O61n-xO91AEtrHXRMRk94w_l0I-h7MMX_-_N7mV4dngQA/exec";

export default function SuratMasuk() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    klasifikasi: "",
    kategoriSurat: "",
    nomor: "",
    instansi: "",
    perihal: "",
    files: [],
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // MULTI FILE
  const handleFile = (e) => {
    setForm({
      ...form,
      files: Array.from(e.target.files),
    });
  };

  // =========================
  // SURAT MASUK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // LOADING
      Swal.fire({
        title: "Menyimpan Arsip...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let filesData = [];

      // MULTI FILE
      if (form.files.length > 0) {
        for (const file of form.files) {
          const reader = new FileReader();

          const base64 = await new Promise((resolve) => {
            reader.readAsDataURL(file);

            reader.onloadend = () => {
              resolve(reader.result);
            };
          });

          filesData.push({
            file: base64,
            fileName: file.name,
          });
        }
      }

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          jenisSurat: "Masuk",
          nomorSurat: form.nomor,
          perihal: form.perihal,
          instansi: form.instansi,
          klasifikasi: form.klasifikasi,
          kategoriSurat: form.kategoriSurat,
          files: filesData,
        }),
      });

      const data = JSON.parse(localStorage.getItem("surat_masuk")) || [];

      localStorage.setItem("surat_masuk", JSON.stringify([...data, form]));

      // SUCCESS
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Surat masuk berhasil disimpan!",
        timer: 1500,
        showConfirmButton: false,
      });

      // RESET
      setForm({
        klasifikasi: "",
        kategoriSurat: "",
        nomor: "",
        instansi: "",
        perihal: "",
        files: [],
      });

      const isAdmin = localStorage.getItem("isAdmin");

      if (isAdmin === "true") {
        navigate("/data/masuk");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);

      Swal.fire("Error", "Gagal kirim data", "error");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Input Surat Masuk</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Klasifikasi</label>

              <input
                type="text"
                name="klasifikasi"
                list="list-klasifikasi-masuk"
                value={form.klasifikasi}
                onChange={handleChange}
                placeholder="Ketik kode atau nama klasifikasi"
                required
              />

              <datalist id="list-klasifikasi-masuk">
                {klasifikasi.map((item, i) => (
                  <option key={i} value={item.kode}>
                    {item.kode} - {item.nama}
                  </option>
                ))}
              </datalist>

              <label>Kategori Surat</label>

              <select
                name="kategoriSurat"
                value={form.kategoriSurat}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Kategori</option>

                <option value="PK">PK</option>
                <option value="BKD">BKD</option>
                <option value="BKA">BKA</option>
                <option value="TU">TU</option>
                <option value="Kepegawaian">Kepegawaian</option>
                <option value="Keuangan">Keuangan</option>
              </select>

              <label>Nomor Surat</label>

              <input
                name="nomor"
                value={form.nomor}
                onChange={handleChange}
                placeholder="Masukkan nomor surat"
                required
              />

              <label>Instansi</label>

              <input
                name="instansi"
                value={form.instansi}
                onChange={handleChange}
                required
              />

              <label>Perihal</label>

              <textarea
                name="perihal"
                value={form.perihal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="upload-box">
              <p>Upload Dokumen</p>

              <div className="file-input">
                <input type="file" multiple onChange={handleFile} required />
              </div>

              <div className="form-full">
                <button type="submit" className="btn-primary full">
                  Simpan Arsip
                </button>

                <button
                  type="button"
                  className="btn-outline full mt-2"
                  onClick={() => {
                    const isAdmin = localStorage.getItem("isAdmin");

                    if (isAdmin === "true") {
                      navigate("/data/masuk");
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <footer className="footer">
        © 2026 E-Arsip Balai Pemasyarakatan Kelas II Amuntai
      </footer>
    </div>
  );
}
