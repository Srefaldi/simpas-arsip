import React, { useEffect, useState } from "react";
import CONFIG from "../config";

const DataSurat = ({ jenis }) => {
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sheetName = jenis === "masuk" ? "SuratMasuk" : "SuratKeluar";
      const response = await fetch(`${CONFIG.URL_GAS}?jenis=${sheetName}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSurat(data.reverse());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jenis]);

  const handleDelete = async (rowNumber) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await fetch(CONFIG.URL_GAS, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "delete",
          jenisSurat: jenis === "masuk" ? "Masuk" : "Keluar",
          rowNumber: rowNumber,
        }),
      });
      alert("Data berhasil dihapus!");
      fetchData();
    } catch (error) {
      alert("Gagal menghapus data");
    }
  };

  const handleFileEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          newFile: reader.result,
          newFileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await fetch(CONFIG.URL_GAS, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "update",
          jenisSurat: jenis === "masuk" ? "Masuk" : "Keluar",
          rowNumber: editData.rowNumber,
          nomorSurat: editData.Nomor_Surat,
          perihal: editData.Perihal,
          instansi: editData.Instansi,
          file: editData.newFile || null,
          fileName: editData.newFileName || null,
        }),
      });
      alert("✅ Data Berhasil Diperbarui!");
      setEditData(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredSurat = surat.filter((s) => {
    const search = searchTerm.toLowerCase();
    return (
      String(s.Nomor_Surat || "")
        .toLowerCase()
        .includes(search) ||
      String(s.Perihal || "")
        .toLowerCase()
        .includes(search) ||
      String(s.Instansi || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="card shadow-sm border-0 rounded-4 animate__animated animate__fadeIn">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h5 className="mb-0 fw-bold text-primary">
          <i
            className={`bi ${jenis === "masuk" ? "bi-inbox-fill" : "bi-send-fill"} me-2`}
          ></i>
          Arsip Surat {jenis === "masuk" ? "Masuk" : "Keluar"}
        </h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm bg-light border-0 px-3"
            placeholder="Cari arsip..."
            style={{ width: "250px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary btn-sm rounded-3 px-3"
            onClick={fetchData}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: "70vh" }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light sticky-top">
              <tr className="small text-muted">
                <th className="px-4">TANGGAL</th>
                <th>NOMOR SURAT</th>
                <th>PERIHAL</th>
                <th>INSTANSI</th>
                <th className="text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </td>
                </tr>
              ) : filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredSurat.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 small">
                      {item.Tanggal
                        ? new Date(item.Tanggal).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="fw-bold text-dark">{item.Nomor_Surat}</td>
                    <td>{item.Perihal}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {item.Instansi}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group shadow-sm rounded-3">
                        <a
                          href={item.Link_File}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-white text-primary border"
                        >
                          <i className="bi bi-eye"></i>
                        </a>
                        <button
                          className="btn btn-sm btn-white text-warning border"
                          onClick={() => setEditData(item)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-white text-danger border"
                          onClick={() => handleDelete(item.rowNumber)}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* MODAL EDIT */}
      {editData && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="card p-4 shadow-lg border-0 rounded-4 animate__animated animate__zoomIn"
            style={{ width: "450px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Edit Data Arsip</h5>
              <button
                className="btn-close"
                onClick={() => setEditData(null)}
              ></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="small fw-bold text-muted">NOMOR SURAT</label>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  value={editData.Nomor_Surat}
                  onChange={(e) =>
                    setEditData({ ...editData, Nomor_Surat: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted">PERIHAL</label>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  value={editData.Perihal}
                  onChange={(e) =>
                    setEditData({ ...editData, Perihal: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted">INSTANSI</label>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  value={editData.Instansi}
                  onChange={(e) =>
                    setEditData({ ...editData, Instansi: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="small fw-bold text-muted">
                  GANTI FILE (OPSIONAL)
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  onChange={handleFileEdit}
                  accept=".pdf,image/*"
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    "Update Data"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-light w-100"
                  onClick={() => setEditData(null)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSurat;
