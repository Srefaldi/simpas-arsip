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

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);

      // FETCH
      const resMasuk = await fetch(`${API_URL}?jenis=SuratMasuk`);

      const resKeluar = await fetch(`${API_URL}?jenis=SuratKeluar`);

      const dataMasuk = await resMasuk.json();

      const dataKeluar = await resKeluar.json();

      // =========================
      // TOTAL
      // =========================

      const totalMasuk = Math.max(
        ...dataMasuk.map((item) => Number(item.NO) || 0),
        0,
      );

      const totalKeluar = Math.max(
        ...dataKeluar.map((item) => Number(item.NO) || 0),
        0,
      );

      setMasuk(totalMasuk);
      setKeluar(totalKeluar);

      // =========================
      // PARSE TANGGAL
      // =========================

      const parseTanggal = (tgl) => {
        if (!tgl) return null;

        const value = tgl.toString().trim();

        // SUPPORT:
        // 16/05/2026
        // 16-05-2026
        // 16.05.2026

        const clean = value.replace(/[.-]/g, "/");

        const parts = clean.split("/");

        if (parts.length !== 3) return null;

        const day = parseInt(parts[0]);

        const month = parseInt(parts[1]);

        const year = parseInt(parts[2]);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
          return null;
        }

        const date = new Date(year, month - 1, day);

        if (isNaN(date.getTime())) {
          return null;
        }

        // HANYA BULAN SEKARANG
        const now = new Date();

        if (
          date.getMonth() !== now.getMonth() ||
          date.getFullYear() !== now.getFullYear()
        ) {
          return null;
        }

        return date;
      };

      // =========================
      // GROUP DATA
      // =========================

      const grouped = {};

      // SURAT MASUK
      dataMasuk.forEach((item) => {
        const date = parseTanggal(item.Tanggal);

        if (!date) return;

        const label = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
        });

        if (!grouped[label]) {
          grouped[label] = {
            tanggal: label,

            masuk: 0,
            keluar: 0,

            sortDate: date,
          };
        }

        grouped[label].masuk += 1;
      });

      // SURAT KELUAR
      dataKeluar.forEach((item) => {
        const date = parseTanggal(item.Tanggal);

        if (!date) return;

        const label = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
        });

        if (!grouped[label]) {
          grouped[label] = {
            tanggal: label,

            masuk: 0,
            keluar: 0,

            sortDate: date,
          };
        }

        grouped[label].keluar += 1;
      });

      // SORT
      const sorted = Object.values(grouped)
        .sort((a, b) => a.sortDate - b.sortDate)
        .map(({ sortDate, ...rest }) => rest);

      setChartData(sorted);
    } catch (err) {
      console.error("Error load data:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SEKALI
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout onRefresh={loadData}>
      <h2 className="title">Overview Arsip</h2>

      {/* =========================
    FULLSCREEN LOADING
========================= */}

      {loading && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>

            <h3>Memuat Data Arsip</h3>

            <p>Mohon tunggu sebentar...</p>
          </div>
        </div>
      )}

      {/* =========================
          CARD
      ========================= */}

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

      {/* =========================
          GRAFIK
      ========================= */}

      <div className="chart-box">
        <h3>Grafik Aktivitas</h3>

        <div
          style={{
            width: "100%",
            height: 220,
            overflow: "hidden",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="tanggal"
                tick={{
                  fontSize: 12,
                }}
                interval="preserveStartEnd"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              {/* SURAT MASUK */}

              <Line
                type="monotone"
                dataKey="masuk"
                stroke="#2563eb"
                strokeWidth={3}
                name="Surat Masuk"
                isAnimationActive={false}
              />

              {/* SURAT KELUAR */}

              <Line
                type="monotone"
                dataKey="keluar"
                stroke="#16a34a"
                strokeWidth={3}
                name="Surat Keluar"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FOOTER */}

      <footer className="footer">
        © 2026 E-Arsip Balai Pemasyarakatan Kelas II Amuntai
      </footer>
    </DashboardLayout>
  );
}
