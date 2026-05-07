import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SuratMasuk from "./pages/SuratMasuk";
import SuratKeluar from "./pages/SuratKeluar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataSurat from "./pages/DataSurat";
import DetailSurat from "./pages/DetailSurat";
import EditSurat from "./pages/EditSurat";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/surat-masuk" element={<SuratMasuk />} />
      <Route path="/surat-keluar" element={<SuratKeluar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/data-surat" element={<DataSurat />} />
      <Route path="/data/masuk" element={<DataSurat jenisDefault="SuratMasuk" />} />
      <Route path="/data/keluar" element={<DataSurat jenisDefault="SuratKeluar" />} />
      <Route path="/detail" element={<DetailSurat />} />
      <Route path="/edit" element={<EditSurat />} />
    </Routes>
  );
}