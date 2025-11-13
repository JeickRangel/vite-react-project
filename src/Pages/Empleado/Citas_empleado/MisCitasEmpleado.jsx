// src/components/MisCitasEmpleado.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./MisCitasEmpleado.module.css";
import { API_BASE } from "/src/config/api";

/* ===== Config API ===== */
//const API_BASE = "http://localhost/barberia_app/php";

const EP = { reservas: `${API_BASE}/reservas.php` };

/* Utilidad: formatear fecha en es-CO */
function formatearFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleString("es-CO", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Clase visual para el estado (solo los que existen en backend) */
function badgeClass(estado, styles) {
  switch (estado) {
    case "pendiente":
      return `${styles.badge} ${styles.badgePendiente}`;
    case "confirmada":
      return `${styles.badge} ${styles.badgeConfirmada}`;
    case "cancelada":
      return `${styles.badge} ${styles.badgeCancelada}`;
    default:
      return styles.badge;
  }
}

export default function MisCitasEmpleado({ currentEmployeeId: currentEmployeeIdProp }) {
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

  /* ===== Estado ===== */
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  /* Controles de filtro */
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas"); // todas | pendiente | confirmada | cancelada
  const [filtroRango, setFiltroRango] = useState("proximas"); // hoy | proximas | todas

  /* ===== Cargar citas del empleado ===== */
  const cargar = async () => {
    if (!empleadoId) {
      setLoading(false);
      setMsg("No hay sesión de empleado.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const qs = new URLSearchParams({ empleado_id: empleadoId });
      const res = await fetch(`${EP.reservas}?` + qs.toString());
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

      const normalizadas = data.map((r) => ({
        id: Number(r.id_reserva),
        clienteNombre: r.cliente,
        telefono: r.telefono || "",
        servicio: r.servicio,
        fechaISO: `${r.fecha}T${(r.hora || "00:00:00").slice(0, 8)}`,
        duracionMin: r.duracion ?? null,
        estado: r.estado,          // pendiente | confirmada | cancelada
        precio: r.precio ?? null,
      }));

      setCitas(normalizadas);
    } catch (e) {
      setMsg("No se pudieron cargar tus citas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar(); // eslint-disable-next-line
  }, [empleadoId]);

  /* ===== Filtro y orden ===== */
  const citasFiltradas = useMemo(() => {
    const ahora = new Date();
    const hoyIni = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    const hoyFin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);
    const dosSemanas = new Date(ahora);
    dosSemanas.setDate(ahora.getDate() + 14);

    return citas
      .filter((c) => {
        if (busqueda.trim() && !c.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase())) {
          return false;
        }
        if (filtroEstado !== "todas" && c.estado !== filtroEstado) {
          return false;
        }
        const f = new Date(c.fechaISO);
        if (filtroRango === "hoy") {
          if (f < hoyIni || f > hoyFin) return false;
        } else if (filtroRango === "proximas") {
          if (f < hoyIni || f > dosSemanas) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.fechaISO) - new Date(b.fechaISO));
  }, [citas, busqueda, filtroEstado, filtroRango]);

  /* ===== Acciones (PUT backend) ===== */
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(EP.reservas, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_reserva: id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "Error");
      setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
      setMsg(`✅ Estado actualizado a "${nuevoEstado}"`);
    } catch (e) {
      setMsg("❌ No se pudo actualizar el estado");
    }
  };

  const confirmarCita = (id) => actualizarEstado(id, "confirmada");

  // “Marcar atendida” usa confirmada (backend no tiene 'completada')
  const marcarCompletada = (id) => actualizarEstado(id, "confirmada");

  const cancelarCita = (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;
    actualizarEstado(id, "cancelada");
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Mis Citas</h2>
        <p>
          {loading ? "Cargando…" : `${citasFiltradas.length} cita(s) encontrada(s)`}
          {msg && <span className={styles.flashMsg}> — {msg}</span>}
        </p>
      </header>

      {/* Toolbar filtros */}
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          type="text"
          placeholder="Buscar por cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className={styles.select}
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          aria-label="Filtro por estado"
        >
          <option value="todas">Estado: todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <select
          className={styles.select}
          value={filtroRango}
          onChange={(e) => setFiltroRango(e.target.value)}
          aria-label="Filtro por rango"
        >
          <option value="proximas">Rango: próximas 2 semanas</option>
          <option value="hoy">Solo hoy</option>
          <option value="todas">Todas</option>
        </select>

        <button className={styles.btnFantasma} onClick={cargar}>
          Recargar
        </button>
      </div>

      {/* TABLA (escritorio) */}
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Duración</th>
              <th>Estado</th>
              <th className={styles.colAcciones}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.vacio}>Cargando…</td>
              </tr>
            ) : citasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.vacio}>
                  No hay citas para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              citasFiltradas.map((c) => (
                <tr key={c.id}>
                  <td>{formatearFecha(c.fechaISO)}</td>
                  <td>
                    <div className={styles.cliente}>
                      <strong>{c.clienteNombre}</strong>
                      {c.telefono ? <span className={styles.telefono}>{c.telefono}</span> : null}
                    </div>
                  </td>
                  <td>{c.servicio}</td>
                  <td>{c.duracionMin ? `${c.duracionMin} min` : "—"}</td>
                  <td>
                    <span className={badgeClass(c.estado, styles)}>{c.estado}</span>
                  </td>
                  <td className={styles.acciones}>
                    {c.estado === "pendiente" && (
                      <button
                        className={`${styles.btn} ${styles.btnSecundario}`}
                        onClick={() => confirmarCita(c.id)}
                      >
                        Confirmar
                      </button>
                    )}
                    {c.estado !== "cancelada" && (
                      <button
                        className={`${styles.btn} ${styles.btnPrimario}`}
                        onClick={() => marcarCompletada(c.id)}
                        disabled={c.estado === "confirmada"}
                        title={c.estado === "confirmada" ? "Ya está confirmada" : "Marcar atendida"}
                      >
                        Marcar atendida
                      </button>
                    )}
                    {c.estado !== "cancelada" && (
                      <button
                        className={`${styles.btn} ${styles.btnPeligro}`}
                        onClick={() => cancelarCita(c.id)}
                        disabled={c.estado === "confirmada" && false /* deja cancelar si quieres */}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      className={`${styles.btn} ${styles.btnFantasma}`}
                      onClick={() => alert("Detalles próximamente")}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TARJETAS (móvil) */}
      <div className={styles.cards}>
        {loading ? (
          <div className={styles.cardVacio}>Cargando…</div>
        ) : citasFiltradas.length === 0 ? (
          <div className={styles.cardVacio}>
            No hay citas para los filtros seleccionados.
          </div>
        ) : (
          citasFiltradas.map((c) => (
            <article key={c.id} className={styles.card}>
              <header className={styles.cardHeader}>
                <h4>{formatearFecha(c.fechaISO)}</h4>
                <span className={badgeClass(c.estado, styles)}>{c.estado}</span>
              </header>
              <div className={styles.cardBody}>
                <p>
                  <strong>Cliente:</strong> {c.clienteNombre}{" "}
                  {c.telefono ? <span className={styles.telefono}>({c.telefono})</span> : null}
                </p>
                <p><strong>Servicio:</strong> {c.servicio}</p>
                <p><strong>Duración:</strong> {c.duracionMin ? `${c.duracionMin} min` : "—"}</p>
              </div>
              <footer className={styles.cardFooter}>
                {c.estado === "pendiente" && (
                  <button
                    className={`${styles.btn} ${styles.btnSecundario}`}
                    onClick={() => confirmarCita(c.id)}
                  >
                    Confirmar
                  </button>
                )}
                {c.estado !== "cancelada" && (
                  <button
                    className={`${styles.btn} ${styles.btnPrimario}`}
                    onClick={() => marcarCompletada(c.id)}
                    disabled={c.estado === "confirmada"}
                    title={c.estado === "confirmada" ? "Ya está confirmada" : "Marcar atendida"}
                  >
                    Marcar atendida
                  </button>
                )}
                {c.estado !== "cancelada" && (
                  <button
                    className={`${styles.btn} ${styles.btnPeligro}`}
                    onClick={() => cancelarCita(c.id)}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  className={`${styles.btn} ${styles.btnFantasma}`}
                  onClick={() => alert("Detalles próximamente")}
                >
                  Ver
                </button>
              </footer>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
