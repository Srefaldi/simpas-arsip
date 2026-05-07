import { useState, useEffect } from "react";
import klasifikasi from "../data/data_klasifikasi.json";
import Swal from "sweetalert2";

export default function FormMasuk() {
  const [form, setForm] = useState({
    kategori: "Surat Masuk",
    klasifikasi: "",
    kategoriSurat: "",
    nomor: "",
    instansi: "",
    perihal: "",
  });

  // AUTO NOMOR
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("surat_masuk")) || [];

    let urutan = 1;

    if (data.length > 0) {
      const last = data[data.length - 1].nomor;
      const num = parseInt(last.split(".").pop());
      if (!isNaN(num)) urutan = num + 1;
    }

    const nomor = `WP.19.PAS.PAS.15.${String(urutan).padStart(2, "0")}`;

    setForm((prev) => ({ ...prev, nomor }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem("surat_masuk")) || [];
    localStorage.setItem("surat_masuk", JSON.stringify([...data, form]));

    Swal.fire("Berhasil", "Surat Masuk disimpan!", "success");
  };

  return (
    <div className="card">
      <h2>Input Surat Masuk</h2>

      <form onSubmit={handleSubmit}>
        <label>Klasifikasi</label>
        <select name="klasifikasi" onChange={handleChange} required>
          <option value="">Pilih Klasifikasi</option>
          {klasifikasi.map((item, i) => (
            <option key={i} value={item.kode}>
              {item.kode} - {item.nama}
            </option>
          ))}
        </select>

        <label>Kategori Surat</label>
        <select name="kategoriSurat" onChange={handleChange} required>
          <option value="">Pilih Kategori</option>
          <option value="PK">PK</option>
          <option value="BKD">BKD</option>
          <option value="BKA">BKA</option>
          <option value="TU">TU</option>
        </select>

        <label>Nomor Surat</label>
        <input value={form.nomor} readOnly />

        <label>Instansi Asal</label>
        <input
          name="instansi"
          onChange={handleChange}
          placeholder="Nama instansi"
          required
        />

        <label>Perihal</label>
        <textarea
          name="perihal"
          onChange={handleChange}
          placeholder="Ringkasan isi surat"
          required
        />

        <button className="btn-primary">Simpan Surat Masuk</button>
      </form>
    </div>
  );
}