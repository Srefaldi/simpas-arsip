import { useState, useEffect } from "react";
import klasifikasi from "../data/data_klasifikasi.json";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxUTEpWoChNPOb0xtYQoi97NYfwztJ_7h_QUbTVptIjTHjspbU1vrEUavD6Iqp8XERjzA/exec";

export default function SuratKeluar() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    klasifikasi: "",
    kategoriSurat: "",
    nomor: "",
    instansi: "BAPAS KELAS II AMUNTAI",
    perihal: "",
    file: null,
  });

  // AUTO NOMOR BERDASARKAN KLASIFIKASI
  useEffect(() => {
    const getNomor = async () => {
      try {
        // cek apakah klasifikasi valid
        const validKlasifikasi = klasifikasi.find(
          (item) => item.kode.toLowerCase() === form.klasifikasi.toLowerCase(),
        );

        // jika belum valid
        if (!validKlasifikasi) {
          setForm((prev) => ({
            ...prev,
            nomor: "",
          }));

          return;
        }

        // loading
        setForm((prev) => ({
          ...prev,
          nomor: "Memuat nomor surat...",
        }));

        const res = await fetch(`${API_URL}?jenis=SuratKeluar`);

        const result = await res.json();

        const urutan = result.length + 1;

        const nomorBaru = `WP.19.PAS.PAS.15.01.${validKlasifikasi.kode} - ${urutan}`;

        setForm((prev) => ({
          ...prev,
          nomor: nomorBaru,
        }));
      } catch (err) {
        console.log(err);

        setForm((prev) => ({
          ...prev,
          nomor: "Gagal memuat nomor",
        }));
      }
    };

    getNomor();
  }, [form.klasifikasi]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let base64File = null;
      let fileName = null;

      // FILE OPSIONAL
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
          kategoriSurat: form.kategoriSurat,
          file: base64File,
          fileName: fileName,
        }),
      });

      // SIMPAN LOCAL
      const data = JSON.parse(localStorage.getItem("surat_keluar")) || [];

      localStorage.setItem("surat_keluar", JSON.stringify([...data, form]));

      // SWEET ALERT + COPY NOMOR
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        html: `
          <p>Surat keluar berhasil disimpan!</p>
          <br/>
          <button
            id="copyNomor"
            class="swal2-confirm swal2-styled"
          >
            Salin Nomor Surat
          </button>
        `,
        showConfirmButton: false,

        didOpen: () => {
          const btn = document.getElementById("copyNomor");

          btn.addEventListener("click", async () => {
            await navigator.clipboard.writeText(form.nomor);

            Swal.fire({
              icon: "success",
              title: "Tersalin",
              text: "Nomor surat berhasil disalin!",
              timer: 1200,
              showConfirmButton: false,
            });
          });
        },
      });

      const isAdmin = localStorage.getItem("isAdmin");

      if (isAdmin === "true") {
        navigate("/data/keluar");
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
        <h2>Input Surat Keluar</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Klasifikasi</label>

              <input
                type="text"
                name="klasifikasi"
                list="list-klasifikasi-keluar"
                value={form.klasifikasi}
                onChange={handleChange}
                placeholder="Ketik kode atau nama klasifikasi"
                required
              />

              <datalist id="list-klasifikasi-keluar">
                {klasifikasi.map((item, i) => (
                  <option key={i} value={item.kode}>
                    {item.kode} - {item.nama}
                  </option>
                ))}
              </datalist>

              <label>Nomor Surat</label>

              <input
                value={form.nomor || "Pilih klasifikasi terlebih dahulu"}
                readOnly
              />
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
              <label>Instansi</label>

              <input name="instansi" value={form.instansi} readOnly />

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
                <input type="file" onChange={handleFile} />
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
