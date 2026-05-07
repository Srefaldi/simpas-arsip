import { useState, useEffect } from "react";
import klasifikasi from "../data/data_klasifikasi.json";
import Swal from "sweetalert2";

export default function FormKeluar() {
  const [form, setForm] = useState({
    kategori: "Surat Keluar",
    klasifikasi: "",
    nomor: "",
    instansi: "",
    perihal: "",
  });

  // AUTO NOMOR
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("surat_keluar")) || [];

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

    const data = JSON.parse(localStorage.getItem("surat_keluar")) || [];
    localStorage.setItem("surat_keluar", JSON.stringify([...data, form]));

    Swal.fire("Berhasil", "Surat Keluar disimpan!", "success");
  };

  return (
    <div className="card">
      <h2>Input Surat Keluar</h2>

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

        <label>Nomor Surat</label>
        <input value={form.nomor} readOnly />

        <label>Tujuan Instansi</label>
        <input
          name="instansi"
          onChange={handleChange}
          placeholder="Nama instansi tujuan"
          required
        />

        <label>Perihal</label>
        <textarea
          name="perihal"
          onChange={handleChange}
          placeholder="Ringkasan isi surat"
          required
        />

        <button className="btn-primary">Simpan Surat Keluar</button>
      </form>
    </div>
  );
}