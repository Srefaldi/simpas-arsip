import React, { useState, useEffect } from "react";
import CONFIG from "../config";
import listKlasifikasi from "../data/data_klasifikasi.json";

const InputSurat = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [nextNumber, setNextNumber] = useState(1); // Default ke 1

  const [formData, setFormData] = useState({
    nomorSurat: "WP.19.PAS.PAS.15.",
    perihal: "",
    instansi: "",
    jenisSurat: "Masuk",
    klasifikasi: "",
    file: null,
    fileName: "",
  });

  // Fungsi mengambil nomor urut terakhir dari database Google Sheets
  const fetchNextNumber = async () => {
    try {
      const response = await fetch(`${CONFIG.URL_GAS}?jenis=SuratKeluar`);
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        // Cari nomor terbesar dari kolom Nomor_Surat
        const numbers = data.map((row) => {
          const match = row.Nomor_Surat?.toString().match(/- (\d+)$/);
          return match ? parseInt(match[1]) : 0;
        });

        const maxNum = Math.max(...numbers);
        setNextNumber(maxNum + 1);
      } else {
        setNextNumber(1); // Jika database kosong (seperti di foto)
      }
    } catch (error) {
      console.error("Gagal mengambil nomor urut:", error);
      setNextNumber(1);
    }
  };

  // Jalankan fetch nomor hanya jika kategori "Keluar" dipilih
  useEffect(() => {
    if (formData.jenisSurat === "Keluar") {
      fetchNextNumber();
    } else {
      setFormData((prev) => ({
        ...prev,
        nomorSurat: "WP.19.PAS.PAS.15.",
        klasifikasi: "",
      }));
      setSearchTerm("");
    }
  }, [formData.jenisSurat]);

  // Handle pilih klasifikasi dari list pencarian
  const handleSelectKlasifikasi = (item) => {
    const prefix = "WP.19.PAS.PAS.15.";
    setFormData({
      ...formData,
      klasifikasi: item.kode,
      // Format: Prefix.Kode - NomorUrut
      nomorSurat: `${prefix}${item.kode} - ${nextNumber}`,
    });
    setSearchTerm(`${item.kode} - ${item.nama}`);
    setShowDropdown(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return alert("Pilih file terlebih dahulu!");
    setLoading(true);

    try {
      await fetch(CONFIG.URL_GAS, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData),
      });

      alert("✅ Data Berhasil Diarsipkan!");

      // Reset Form & Refresh nomor urut untuk input selanjutnya
      setFormData({
        nomorSurat: "WP.19.PAS.PAS.15.",
        perihal: "",
        instansi: "",
        jenisSurat: "Masuk",
        klasifikasi: "",
        file: null,
        fileName: "",
      });
      setSearchTerm("");
      document.getElementById("inputFile").value = "";

      if (formData.jenisSurat === "Keluar") fetchNextNumber();
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = listKlasifikasi.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container-fluid p-0 animate__animated animate__fadeIn">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Input Arsip Baru</h4>
          <p className="text-muted small mb-0">
            Lengkapi detail surat Bapas Amuntai
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-lg-7">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold small text-secondary">
                          KATEGORI ARSIP
                        </label>
                        <select
                          className="form-select border-0 bg-light py-2"
                          value={formData.jenisSurat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jenisSurat: e.target.value,
                            })
                          }
                        >
                          <option value="Masuk">📥 Surat Masuk</option>
                          <option value="Keluar">📤 Surat Keluar</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        {formData.jenisSurat === "Keluar" && (
                          <div className="position-relative">
                            <label className="form-label fw-bold small text-secondary">
                              CARI KLASIFIKASI
                            </label>
                            <input
                              type="text"
                              className="form-control border-0 bg-light py-2"
                              placeholder="Ketik kode/nama..."
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowDropdown(true);
                                setFormData({ ...formData, klasifikasi: "" });
                              }}
                              onFocus={() => setShowDropdown(true)}
                              required
                            />
                            {showDropdown && searchTerm && (
                              <ul
                                className="list-group position-absolute w-100 shadow-lg mt-1"
                                style={{
                                  zIndex: 1000,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteredData.map((k, idx) => (
                                  <li
                                    key={idx}
                                    className="list-group-item list-group-item-action small py-2"
                                    onClick={() => handleSelectKlasifikasi(k)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <strong>{k.kode}</strong> - {k.nama}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary">
                          NOMOR SURAT
                        </label>
                        <input
                          type="text"
                          className="form-control border-0 bg-light py-2 font-monospace fw-bold text-primary"
                          value={formData.nomorSurat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nomorSurat: e.target.value,
                            })
                          }
                          required
                        />
                        <div className="form-text small text-info">
                          {formData.jenisSurat === "Keluar"
                            ? `*Nomor urut ${nextNumber} otomatis terisi`
                            : "*Input nomor urut secara manual"}
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary">
                          ASAL / TUJUAN INSTANSI
                        </label>
                        <input
                          type="text"
                          className="form-control border-0 bg-light py-2"
                          placeholder="Nama instansi..."
                          value={formData.instansi}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instansi: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary">
                          PERIHAL SURAT
                        </label>
                        <textarea
                          className="form-control border-0 bg-light py-2"
                          rows="3"
                          placeholder="Ringkasan isi surat..."
                          value={formData.perihal}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              perihal: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <label className="form-label fw-bold small text-secondary">
                      UNGGAH DOKUMEN
                    </label>
                    <div
                      className="upload-container border-2 border-dashed rounded-4 p-4 d-flex flex-column align-items-center justify-content-center bg-light h-100"
                      style={{ minHeight: "300px" }}
                    >
                      <i
                        className={`bi ${formData.file ? "bi-file-earmark-check-fill text-success" : "bi-cloud-arrow-up-fill text-primary"} display-1 mb-3`}
                      ></i>
                      <h6 className="fw-bold text-truncate w-100 px-3">
                        {formData.fileName || "Pilih File"}
                      </h6>
                      <input
                        type="file"
                        id="inputFile"
                        className="d-none"
                        onChange={handleFileChange}
                        accept=".pdf,image/*"
                      />
                      <label
                        htmlFor="inputFile"
                        className="btn btn-primary rounded-pill px-4 mt-3"
                      >
                        Cari Dokumen
                      </label>
                    </div>
                  </div>

                  <div className="col-12 mt-4 text-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-5 py-2 fw-bold shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        "Simpan Arsip"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSurat;
