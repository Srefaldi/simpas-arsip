import React, { useEffect, useState } from "react";
import CONFIG from "../config";
import Swal from "sweetalert2";

const DataSurat = ({ jenis }) => {
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sheetName = jenis === "masuk" ? "SuratMasuk" : "SuratKeluar";
      const response = await fetch(`${CONFIG.URL_GAS}?jenis=${sheetName}`);
      const data = await response.json();
      if (Array.isArray(data)) setSurat(data.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jenis]);

  const handleDelete = async (rowNumber) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data akan dihapus permanen dari cloud!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      Swal.fire({ title: "Menghapus...", didOpen: () => Swal.showLoading() });
      await fetch(CONFIG.URL_GAS, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "delete",
          jenisSurat: jenis === "masuk" ? "Masuk" : "Keluar",
          rowNumber,
        }),
      });
      Swal.fire("Terhapus!", "Data berhasil dibuang.", "success");
      fetchData();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Menyimpan...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await fetch(CONFIG.URL_GAS, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "update",
          jenisSurat: jenis === "masuk" ? "Masuk" : "Keluar",
          rowNumber: editingItem.rowNumber,
          nomorSurat: editingItem.Nomor_Surat,
          perihal: editingItem.Perihal,
          instansi: editingItem.Instansi,
        }),
      });
      Swal.fire("Berhasil!", "Data telah diperbarui.", "success");
      setEditingItem(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Gagal memperbarui data", "error");
    }
  };

  const filteredSurat = surat.filter((s) =>
    [s.Nomor_Surat, s.Perihal, s.Instansi].some((val) =>
      String(val || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <div className="card shadow mb-4 border-0 animate__animated animate__fadeIn">
      <div className="card-header py-3 d-flex justify-content-between align-items-center bg-white border-bottom">
        <h6 className="m-0 font-weight-bold text-primary">
          Tabel Arsip {jenis === "masuk" ? "Masuk" : "Keluar"}
        </h6>
        <div className="input-group" style={{ width: "250px" }}>
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Cari..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover border-0">
            <thead className="bg-light text-gray-800">
              <tr>
                <th>Tanggal</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Instansi</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                    <div className="mt-2 text-muted">Memproses data...</div>
                  </td>
                </tr>
              ) : filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredSurat.map((item, i) => (
                  <tr key={i} className="align-middle">
                    {/* TAMPILAN TANGGAL HANYA TGL-BLN-THN */}
                    <td>
                      {item.Tanggal
                        ? new Date(item.Tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="font-weight-bold text-primary">
                      {item.Nomor_Surat}
                    </td>
                    <td>{item.Perihal}</td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {item.Instansi}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <a
                          href={item.Link_File}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-info btn-circle btn-sm text-white"
                          title="Lihat PDF"
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                        <button
                          className="btn btn-warning btn-circle btn-sm text-white"
                          title="Edit"
                          onClick={() => setEditingItem(item)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-circle btn-sm"
                          title="Hapus"
                          onClick={() => handleDelete(item.rowNumber)}
                        >
                          <i className="fas fa-trash"></i>
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
      {editingItem && (
        <div
          className="modal d-block animate__animated animate__fadeIn"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Data Surat</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditingItem(null)}
                ></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Nomor Surat
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      value={editingItem.Nomor_Surat}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          Nomor_Surat: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Instansi
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      value={editingItem.Instansi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          Instansi: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Perihal
                    </label>
                    <textarea
                      className="form-control border-0 bg-light"
                      rows="3"
                      value={editingItem.Perihal}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          Perihal: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0 p-3">
                  <button
                    type="button"
                    className="btn btn-light px-4"
                    onClick={() => setEditingItem(null)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSurat;
