// src/components/InicioEmpleado.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./InicioEmpleado.css";
import { API_BASE } from "../config/api";

/* ===== API ===== */
//const API_BASE = "http://localhost/barberia_app/php";
export const API_BASE = "https://barberia-render.onrender.com/barberia_app/php"
const EP = { reservas: `${API_BASE}/reservas.php` };

/* ===== Helpers ===== */
const pad = (n) => String(n).padStart(2, "0");
const hoyStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const ahoraISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
};
const rangoMesActual = () => {
  const d = new Date();
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0); // último día del mes
  const f = (x) => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
  return { inicio: f(start), fin: f(end) };
};
const horaBonita = (iso) =>
  new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

export default function InicioEmpleado({ currentEmployeeId: currentEmployeeIdProp }) {
  /* ===== Sesión empleado: prop o localStorage ===== */
  const empleadoId = useMemo(() => {
    if (currentEmployeeIdProp) return currentEmployeeIdProp;
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
  }, [currentEmployeeIdProp]);

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const cargar = async () => {
      if (!empleadoId) {
        setLoading(false);
        setMsg("No hay sesión de empleado.");
        return;
      }
      setLoading(true);
      setMsg("");
      try {
        // Traemos TODAS las citas del empleado (si prefieres, puedes filtrar por rango en el PHP)
        const qs = new URLSearchParams({ empleado_id: empleadoId });
        const res = await fetch(`${EP.reservas}?` + qs.toString());
        const data = await res.json();
        setCitas(Array.isArray(data) ? data : []);
      } catch (e) {
        setMsg("No se pudieron cargar tus citas.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [empleadoId]);

  /* ===== Cálculos ===== */
  const {
    resumenHoy,
    proxima,
    reporteMes,
  } = useMemo(() => {
    const hoy = hoyStr();
    const ahora = ahoraISO();
    const { inicio, fin } = rangoMesActual();

    // Normalizamos a ISO para comparar
    const toISO = (r) => `${r.fecha}T${(r.hora || "00:00:00").slice(0, 8)}`;

    // --- HOY ---
    const citasHoy = citas.filter((r) => r.fecha === hoy);
    const atendidasHoy = citasHoy.filter((r) => r.estado === "completada").length;
    const pendientesHoy = citasHoy.filter(
      (r) => r.estado === "pendiente" || r.estado === "confirmada"
    ).length;

    // Próxima cita (pendiente/confirmada a partir de ahora)
    const proximas = citas
      .filter((r) => (r.estado === "pendiente" || r.estado === "confirmada"))
      .map((r) => ({ ...r, iso: toISO(r) }))
      .filter((r) => r.iso >= ahora)
      .sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0));
    const prox = proximas[0] || null;

    // --- MES ---
    const enMes = citas
      .filter((r) => r.fecha >= inicio && r.fecha <= fin)
      .map((r) => ({ ...r, iso: toISO(r) }));

    const totalMes = enMes.length;

    // Servicio más solicitado (entre completadas del mes)
    const completadasMes = enMes.filter((r) => r.estado === "completada");
    const conteoServicios = new Map();
    for (const r of completadasMes) {
      const key = r.servicio || "Sin nombre";
      conteoServicios.set(key, (conteoServicios.get(key) || 0) + 1);
    }
    let servicioMasSolicitado = "—";
    if (conteoServicios.size > 0) {
      servicioMasSolicitado = [...conteoServicios.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }

    // Clientes atendidos (distintos) del mes en completadas
    const clientesSet = new Set(completadasMes.map((r) => r.cliente));
    const clientesAtendidos = clientesSet.size;

    return {
      resumenHoy: {
        citasHoy: citasHoy.length,
        atendidas: atendidasHoy,
        pendientes: pendientesHoy,
      },
      proxima: prox
        ? {
            cliente: prox.cliente,
            servicio: prox.servicio,
            hora: horaBonita(prox.iso),
          }
        : null,
      reporteMes: {
        totalMes,
        servicioMasSolicitado,
        clientesAtendidos,
      },
    };
  }, [citas]);

  return (
    <main className="empleado-dashboard">
      <h1>Bienvenido, Barbero</h1>
      {msg && <p style={{ color: "#c00", marginTop: 8 }}>{msg}</p>}
      {loading && <p>Cargando…</p>}

      {/* Resumen del día */}
      <section className="dashboard-card">
        <h2>Resumen de Hoy</h2>
        <p><strong>Citas hoy:</strong> {resumenHoy.citasHoy}</p>
        <p><strong>Atendidas:</strong> {resumenHoy.atendidas}</p>
        <p><strong>Pendientes:</strong> {resumenHoy.pendientes}</p>
      </section>

      {/* Próxima cita */}
      <section className="dashboard-card">
        <h2>Próxima Cita</h2>
        {proxima ? (
          <>
            <p><strong>Cliente:</strong> {proxima.cliente}</p>
            <p><strong>Servicio:</strong> {proxima.servicio}</p>
            <p><strong>Hora:</strong> {proxima.hora}</p>
            <button onClick={() => (window.location.href = "/Empleado/MisCitasEmpleado")}>
              Ver detalles
            </button>
          </>
        ) : (
          <p>No tienes próximas citas.</p>
        )}
      </section>

      {/* Reporte personal */}
      <section className="dashboard-card">
        <h2>Reporte Personal (mes actual)</h2>
        <p><strong>Total citas este mes:</strong> {reporteMes.totalMes}</p>
        <p><strong>Servicio más solicitado:</strong> {reporteMes.servicioMasSolicitado}</p>
        <p><strong>Clientes atendidos:</strong> {reporteMes.clientesAtendidos}</p>
      </section>
    </main>
  );
}
