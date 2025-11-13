// src/components/ReportesEmpleado.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ReportesEmpleado.module.css";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { API_BASE } from "/src/config/api";

/* ====== CONFIG API ====== */
//const API_BASE = "http://localhost/barberia_app/php";

const EP = { reservas: `${API_BASE}/reservas.php` };

/* ====== HELPERS ====== */
const toTitle = (s = "") => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const fmtMoney = (n) => (n ?? 0).toLocaleString("es-CO");
const fmtISO = (fecha, hora = "00:00:00") => `${fecha}T${(hora || "00:00:00").slice(0, 8)}`;

function rangoActual(tipo /* 'hoy' | 'semana' | 'mes' */) {
  const hoy = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (tipo === "hoy") {
    const ymd = toYMD(hoy);
    return { inicio: ymd, fin: ymd };
  }
  if (tipo === "semana") {
    // semana (Lunes-Domingo)
    const dow = (hoy.getDay() + 6) % 7; // 0=Lunes
    const start = new Date(hoy); start.setDate(hoy.getDate() - dow);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    return { inicio: toYMD(start), fin: toYMD(end) };
  }
  // mes actual
  const start = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const end = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  return { inicio: toYMD(start), fin: toYMD(end) };
}

function useEmpleadoId(fromProp) {
  return useMemo(() => {
    if (fromProp) return fromProp;
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("usuario") ||
        localStorage.getItem("authUser");
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj?.id ?? obj?.user?.id ?? obj?.usuario?.id ?? null;
    } catch {
      return null;
    }
  }, [fromProp]);
}

/* ====== COMPONENTE ====== */
export default function ReportesEmpleado({ currentEmployeeId: currentEmployeeIdProp }) {
  const empleadoId = useEmpleadoId(currentEmployeeIdProp);

  // Filtros de rango
  const [tipoRango, setTipoRango] = useState("mes"); // 'hoy' | 'semana' | 'mes' | 'custom'
  const [fechaInicio, setFechaInicio] = useState(rangoActual("mes").inicio);
  const [fechaFin, setFechaFin] = useState(rangoActual("mes").fin);

  // Datos
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Cargar datos del backend
  useEffect(() => {
    const { inicio, fin } =
      tipoRango === "custom" ? { inicio: fechaInicio, fin: fechaFin } : rangoActual(tipoRango);

    setFechaInicio(inicio);
    setFechaFin(fin);

    const cargar = async () => {
      if (!empleadoId) {
        setLoading(false);
        setMsg("No hay sesión de empleado.");
        return;
      }
      setLoading(true);
      setMsg("");
      try {
        const qs = new URLSearchParams({
          empleado_id: String(empleadoId),
          fecha_inicio: inicio,
          fecha_fin: fin,
        });
        const res = await fetch(`${EP.reservas}?` + qs.toString());
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        // Normaliza a shape de UI
        const norm = data.map((r) => ({
          id: Number(r.id_reserva),
          cliente: r.cliente,
          servicio: r.servicio,
          fechaISO: fmtISO(r.fecha, r.hora),
          estado: r.estado,          // 'pendiente' | 'confirmada' | 'cancelada' | ... (según tu backend)
          precio: Number(r.precio ?? 0),
        }));
        setCitas(norm);
      } catch (e) {
        console.error(e);
        setMsg("No se pudieron cargar los reportes.");
        setCitas([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [empleadoId, tipoRango]); // fechaInicio/fechaFin se sincronizan arriba

  // Recalcular cuando el usuario edite manualmente en custom
  useEffect(() => {
    if (tipoRango !== "custom") return;
    const cargarCustom = async () => {
      if (!empleadoId || !fechaInicio || !fechaFin) return;
      setLoading(true);
      setMsg("");
      try {
        const qs = new URLSearchParams({
          empleado_id: String(empleadoId),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        });
        const res = await fetch(`${EP.reservas}?` + qs.toString());
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        const norm = data.map((r) => ({
          id: Number(r.id_reserva),
          cliente: r.cliente,
          servicio: r.servicio,
          fechaISO: fmtISO(r.fecha, r.hora),
          estado: r.estado,
          precio: Number(r.precio ?? 0),
        }));
        setCitas(norm);
      } catch (e) {
        console.error(e);
        setMsg("No se pudieron cargar los reportes.");
        setCitas([]);
      } finally {
        setLoading(false);
      }
    };
    cargarCustom();
  }, [tipoRango, fechaInicio, fechaFin, empleadoId]);

  /* ====== MÉTRICAS ====== */
  const { totalCitas, completadas, canceladas, pendientes, ingresos } = useMemo(() => {
    // En tu backend los estados son minúsculas: 'pendiente', 'confirmada', 'cancelada'
    const comp = citas.filter((c) => c.estado === "confirmada" || c.estado === "completada").length;
    const canc = citas.filter((c) => c.estado === "cancelada").length;
    const pend = citas.filter((c) => c.estado === "pendiente").length;
    const total = citas.length;
    const ing = citas
      .filter((c) => c.estado === "confirmada" || c.estado === "completada")
      .reduce((sum, c) => sum + (c.precio || 0), 0);

    return { totalCitas: total, completadas: comp, canceladas: canc, pendientes: pend, ingresos: ing };
  }, [citas]);

  // Data para gráficas
  const dataEstados = useMemo(() => ([
    { name: "Completadas", value: completadas },
    { name: "Canceladas", value: canceladas },
    { name: "Pendientes", value: pendientes },
  ]), [completadas, canceladas, pendientes]);

  const dataBarras = useMemo(() => {
    // Citas por día de la semana dentro del rango
    const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const counts = Array(7).fill(0);
    citas.forEach((c) => {
      const d = new Date(c.fechaISO);
      // convertir a 0..6 con 0=Lun
      const idx = (d.getDay() + 6) % 7;
      counts[idx] += 1;
    });
    return labels.map((dia, i) => ({ dia, citas: counts[i] }));
  }, [citas]);

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

  return (
    <div className={styles.reportesContainer}>
      <h2>📊 Reportes del Empleado</h2>

      <div className={styles.filtros}>
        <label>Rango:</label>
        <select
          className={styles.select}
          value={tipoRango}
          onChange={(e) => setTipoRango(e.target.value)}
        >
          <option value="hoy">Hoy</option>
          <option value="semana">Semana actual</option>
          <option value="mes">Mes actual</option>
          <option value="custom">Personalizado</option>
        </select>

        {tipoRango === "custom" && (
          <div className={styles.customRow}>
            <label>Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            <label>Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
        )}

        {msg && <span className={styles.flashMsg}>{msg}</span>}
      </div>

      {/* Tarjetas de resumen */}
      <div className={styles.tarjetas}>
        <div className={`${styles.tarjeta} ${styles.total}`}>
          <h3>Total Citas</h3>
          <p>{loading ? "…" : totalCitas}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.completadas}`}>
          <h3>Completadas</h3>
          <p>{loading ? "…" : completadas}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.canceladas}`}>
          <h3>Canceladas</h3>
          <p>{loading ? "…" : canceladas}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.pendientes}`}>
          <h3>Pendientes</h3>
          <p>{loading ? "…" : pendientes}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.ingresos}`}>
          <h3>Ingresos</h3>
          <p>${loading ? "…" : fmtMoney(ingresos)}</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className={styles.graficas}>
        <div className={styles.grafica}>
          <h4>Citas por Día</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="dia" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="citas" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.grafica}>
          <h4>Estado de las Citas</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataEstados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {dataEstados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className={styles.tablaContainer}>
        <h4>Detalle de Citas</h4>
        <table className={styles.tablaCitas}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className={styles.vacio}>Cargando…</td></tr>
            ) : citas.length === 0 ? (
              <tr><td colSpan="5" className={styles.vacio}>Sin resultados en el rango.</td></tr>
            ) : (
              citas.map((c) => (
                <tr key={c.id}>
                  <td>{c.cliente}</td>
                  <td>{c.servicio}</td>
                  <td>{new Date(c.fechaISO).toLocaleString("es-CO")}</td>
                  <td>{toTitle(c.estado)}</td>
                  <td>${fmtMoney(c.precio)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
