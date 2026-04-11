import React, { useState } from "react";
import CONFIG from "../config";

const InputSurat = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomorSurat: "",
    perihal: "",
    instansi: "",
    jenisSurat: "Masuk",
    file: null,
    fileName: "",
  });

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
      setFormData({
        nomorSurat: "",
        perihal: "",
        instansi: "",
        jenisSurat: "Masuk",
        file: null,
        fileName: "",
      });
      document.getElementById("inputFile").value = "";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 animate__animated animate__fadeIn">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Input Arsip Baru</h4>
          <p className="text-muted small mb-0">
            Lengkapi detail surat untuk disimpan ke database
          </p>
        </div>
        <i className="bi bi-file-earmark-text fs-2 text-primary opacity-25"></i>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Bagian Kiri: Detail Surat */}
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
                        <label className="form-label fw-bold small text-secondary">
                          NOMOR SURAT
                        </label>
                        <input
                          type="text"
                          className="form-control border-0 bg-light py-2"
                          placeholder="Ketik nomor surat..."
                          value={formData.nomorSurat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nomorSurat: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary">
                          ASAL / TUJUAN INSTANSI
                        </label>
                        <input
                          type="text"
                          className="form-control border-0 bg-light py-2"
                          placeholder="Masukkan nama instansi terkait"
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
                          placeholder="Jelaskan ringkasan perihal surat..."
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

                  {/* Bagian Kanan: Upload File */}
                  <div className="col-lg-5">
                    <label className="form-label fw-bold small text-secondary">
                      UNGGAH DOKUMEN (PDF/JPG)
                    </label>
                    <div
                      className="upload-container border-2 border-dashed rounded-4 p-4 d-flex flex-column align-items-center justify-content-center bg-light text-center h-100"
                      style={{ minHeight: "250px" }}
                    >
                      <i
                        className={`bi ${formData.file ? "bi-file-earmark-check-fill text-success" : "bi-cloud-arrow-up-fill text-primary"} display-1 mb-3`}
                      ></i>

                      <div className="mb-3">
                        <h6 className="fw-bold mb-1">
                          {formData.fileName || "Pilih File Dokumen"}
                        </h6>
                        <p className="text-muted small">
                          Maksimal ukuran file 10MB
                        </p>
                      </div>

                      <input
                        type="file"
                        id="inputFile"
                        className="d-none"
                        onChange={handleFileChange}
                        accept=".pdf,image/*"
                      />
                      <label
                        htmlFor="inputFile"
                        className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-bold"
                      >
                        {formData.file ? "Ganti File" : "Cari Dokumen"}
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-5">
                    <hr className="text-light-emphasis" />
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-5 py-2 fw-bold rounded-3 shadow-sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan Arsip"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .border-dashed { border-style: dashed !important; }
        .upload-container { transition: all 0.2s ease-in-out; border-color: #dee2e6; }
        .upload-container:hover { border-color: #0d6efd; background-color: #f8f9fa !important; }
        .form-control:focus, .form-select:focus { background-color: #fff !important; box-shadow: 0 0 0 0.25 dark; border: 1px solid #dee2e6; }
      `}</style>
    </div>
  );
};

export default InputSurat;
