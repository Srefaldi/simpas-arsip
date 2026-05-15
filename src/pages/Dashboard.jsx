import DashboardLayout from "../components/layout/DashboardLayout";
import { FaInbox, FaPaperPlane } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwQzk-r9vNG0UsqeN-4GBVX7O61n-xO91AEtrHXRMRk94w_l0I-h7MMX_-_N7mV4dngQA/exec";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [masuk, setMasuk] = useState(0);
  const [keluar, setKeluar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kategoriCount, setKategoriCount] = useState({
    PK: 0,
    BKD: 0,
    BKA: 0,
    TU: 0,
    Kepegawaian: 0,
    Keuangan: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);

      // 🔥 AMBIL DATA MASUK & KELUAR TERPISAH
      const resMasuk = await fetch(`${API_URL}?jenis=SuratMasuk`);
      const resKeluar = await fetch(`${API_URL}?jenis=SuratKeluar`);

      const dataMasuk = await resMasuk.json();
      const dataKeluar = await resKeluar.json();

      // ✅ TOTAL
      setMasuk(dataMasuk.length);
      setKeluar(dataKeluar.length);

      // 🔥 GABUNGKAN UNTUK GRAFIK
      const grouped = {};

      // SURAT MASUK
      dataMasuk.forEach((item) => {
        const tgl = item.Tanggal
          ? new Date(item.Tanggal).toLocaleDateString()
          : "Tidak ada";

        if (!grouped[tgl]) {
          grouped[tgl] = { tanggal: tgl, masuk: 0, keluar: 0 };
        }

        grouped[tgl].masuk += 1;
      });

      // SURAT KELUAR
      dataKeluar.forEach((item) => {
        const tgl = item.Tanggal
          ? new Date(item.Tanggal).toLocaleDateString()
          : "Tidak ada";

        if (!grouped[tgl]) {
          grouped[tgl] = { tanggal: tgl, masuk: 0, keluar: 0 };
        }

        grouped[tgl].keluar += 1;
      });

      setChartData(Object.values(grouped));
    } catch (err) {
      console.error("Error load data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD SEKALI SAJA
  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout onRefresh={loadData}>
      <h2 className="title">Overview Arsip</h2>

      {/* LOADING */}
      {loading && <p style={{ marginTop: 10 }}> Memuat Data...</p>}

      {/* CARD */}
      <div className="stats">
        <div className="stat-box blue">
          <div>
            <p>SURAT MASUK</p>
            <h2>{masuk}</h2>
          </div>
          <FaInbox size={26} />
        </div>

        <div className="stat-box green">
          <div>
            <p>SURAT KELUAR</p>
            <h2>{keluar}</h2>
          </div>
          <FaPaperPlane size={26} />
        </div>
      </div>

      {/* GRAFIK */}
      <div className="chart-box">
        <h3>Grafik Aktivitas</h3>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tanggal" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="masuk"
              stroke="#2563eb"
              strokeWidth={3}
              name="Surat Masuk"
            />

            <Line
              type="monotone"
              dataKey="keluar"
              stroke="#16a34a"
              strokeWidth={3}
              name="Surat Keluar"
            />
          </LineChart>
        </ResponsiveContainer>
        <footer className="footer">
          © 2026 E-Arsip Balai Pemasyarakatan Kelas II Amuntai
        </footer>
      </div>
    </DashboardLayout>
  );
}
