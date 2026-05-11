import { useState, useEffect } from "react";
import klasifikasi from "../data/data_klasifikasi.json";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = "https://script.google.com/macros/s/AKfycbydrpdtBLlx8_RWMH9w3E12onEi_mr_Im2HCehkxEe6KKQGgc2aEx40lq_iz2ID00PONQ/exec";

export default function SuratKeluar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    klasifikasi: "",
    nomor: "",
    instansi: "",
    perihal: "",
    file: null,
  });

  // AUTO NOMOR (sementara masih pakai local)
  useEffect(() => {
  const getNomor = async () => {
    try {
      const res = await fetch(`${API_URL}?jenis=SuratKeluar`);
      const result = await res.json();

      let urutan = 1;

      if (result.length > 0) {
  const nomorList = result.map((item) => {
    const nomor = item.Nomor_Surat;

    if (!nomor) return 0;

    const angka = parseInt(
      nomor.split(".").pop()
    );

    return isNaN(angka) ? 0 : angka;
  });

  urutan = Math.max(...nomorList) + 1;
}

      const nomorBaru = `WP.19.PAS.PAS.15.${String(
        urutan
      ).padStart(2, "0")}`;

      setForm((prev) => ({
        ...prev,
        nomor: nomorBaru,
      }));

    } catch (err) {
      console.log(err);
    }
  };

  getNomor();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let base64File = null;
      let fileName = null;

      if (form.file) {
        const reader = new FileReader();
        reader.readAsDataURL(form.file);

        await new Promise((resolve) => {
          reader.onloadend = () => {
            base64File = reader.result;
            fileName = form.file.name;
            resolve();
          };
        });
      }

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          jenisSurat: "Keluar",
          nomorSurat: form.nomor,
          perihal: form.perihal,
          instansi: form.instansi,
          klasifikasi: form.klasifikasi,
          file: base64File,
          fileName: fileName,
        }),
      });

      // simpan lokal (opsional)
      const data = JSON.parse(localStorage.getItem("surat_keluar")) || [];
      localStorage.setItem("surat_keluar", JSON.stringify([...data, form]));

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Surat keluar berhasil disimpan!",
        timer: 1500,
        showConfirmButton: false,
      });

      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "true") {
        navigate("/data/keluar");
      } else {
        navigate("/");
      }

    } catch (err) {
      Swal.fire("Error", "Gagal kirim data", "error");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Input Surat Keluar</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div>
              <label>Klasifikasi</label>
              <select name="klasifikasi" onChange={handleChange} required>
                <option value="">Pilih Klasifikasi</option>
                {klasifikasi.map((item, i) => (
                  <option key={i} value={item.kode}>
                    {item.kode} - {item.nama}
                  </option>
                ))}
              </select>

              <label>Nomor Surat</label>
              <input value={form.nomor || "Memuat nomor surat..."} readOnly />

              <label>Instansi</label>
              <input name="instansi" onChange={handleChange} required />

              <label>Perihal</label>
              <textarea name="perihal" onChange={handleChange} required />
            </div>

            <div className="upload-box">
              <p>Upload Dokumen</p>
              <div className="file-input">
                <input
                  type="file"
                  onChange={handleFile}
                  required
                />
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
                  navigate("/data/keluar");
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