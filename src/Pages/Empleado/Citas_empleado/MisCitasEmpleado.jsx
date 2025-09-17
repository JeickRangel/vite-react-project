import React, { useMemo, useState } from "react";
import styles from "./MisCitasEmpleado.module.css";

/* Utilidad: formatear fecha en español de Colombia */
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

/* Clase visual para el estado */
function badgeClass(estado, styles) {
  switch (estado) {
    case "pendiente":
      return `${styles.badge} ${styles.badgePendiente}`;
    case "confirmada":
      return `${styles.badge} ${styles.badgeConfirmada}`;
    case "completada":
      return `${styles.badge} ${styles.badgeCompletada}`;
    case "cancelada":
      return `${styles.badge} ${styles.badgeCancelada}`;
    default:
      return styles.badge;
  }
}

export default function MisCitasEmpleado() {
  /* Datos de ejemplo (luego los reemplazas por fetch a tu PHP) */
  const [citas, setCitas] = useState([
    {
      id: 1,
      clienteNombre: "Luis Romero",
      telefono: "3001234567",
      servicio: "Corte + Barba",
      fechaISO: "2025-09-17T09:30:00",
      duracionMin: 60,
      estado: "confirmada",
      notas: "Prefiere degradado medio",
    },
    {
      id: 2,
      clienteNombre: "Camilo Díaz",
      telefono: "3015558888",
      servicio: "Corte clásico",
      fechaISO: "2025-09-16T16:00:00",
      duracionMin: 40,
      estado: "pendiente",
      notas: "",
    },
    {
      id: 3,
      clienteNombre: "Andrés Pérez",
      telefono: "3029991122",
      servicio: "Afeitado",
      fechaISO: "2025-09-20T11:00:00",
      duracionMin: 30,
      estado: "pendiente",
      notas: "Piel sensible",
    },
    {
      id: 4,
      clienteNombre: "Juanita R.",
      telefono: "3047770000",
      servicio: "Perfilado de barba",
      fechaISO: "2025-09-15T10:30:00",
      duracionMin: 30,
      estado: "completada",
      notas: "",
    },
    {
      id: 5,
      clienteNombre: "Carlos G.",
      telefono: "3156667788",
      servicio: "Corte + Cejas",
      fechaISO: "2025-09-18T15:00:00",
      duracionMin: 50,
      estado: "cancelada",
      notas: "Reagendó para la otra semana",
    },
  ]);

  /* Controles de filtro */
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas"); // todas | pendiente | confirmada | completada | cancelada
  const [filtroRango, setFiltroRango] = useState("proximas"); // hoy | proximas | todas

  /* Filtrado + orden */
  const citasFiltradas = useMemo(() => {
    const ahora = new Date();
    const hoyIni = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      0,
      0,
      0
    );
    const hoyFin = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      23,
      59,
      59
    );
    const dosSemanas = new Date(ahora);
    dosSemanas.setDate(ahora.getDate() + 14);

    return citas
      .filter((c) => {
        if (
          busqueda.trim() &&
          !c.clienteNombre.toLowerCase().includes(busqueda.toLowerCase())
        ) {
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

  /* Acciones locales (UI optimista, sin backend por ahora) */
  const marcarCompletada = (id) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: "completada" } : c))
    );
  };

  const cancelarCita = (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: "cancelada" } : c))
    );
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Mis Citas</h2>
        <p>{citasFiltradas.length} cita(s) encontrada(s)</p>
      </header>

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
          <option value="completada">Completada</option>
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
      </div>

      {/* Vista TABLA (escritorio) */}
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
            {citasFiltradas.length === 0 ? (
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
                      <span className={styles.telefono}>{c.telefono}</span>
                    </div>
                  </td>
                  <td>{c.servicio}</td>
                  <td>{c.duracionMin} min</td>
                  <td>
                    <span className={badgeClass(c.estado, styles)}>
                      {c.estado}
                    </span>
                  </td>
                  <td className={styles.acciones}>
                    {c.estado !== "completada" && c.estado !== "cancelada" && (
                      <button
                        className={`${styles.btn} ${styles.btnPrimario}`}
                        onClick={() => marcarCompletada(c.id)}
                      >
                        Marcar atendida
                      </button>
                    )}
                    {c.estado !== "cancelada" && c.estado !== "completada" && (
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista TARJETAS (móvil) */}
      <div className={styles.cards}>
        {citasFiltradas.length === 0 ? (
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
                  <span className={styles.telefono}>({c.telefono})</span>
                </p>
                <p>
                  <strong>Servicio:</strong> {c.servicio}
                </p>
                <p>
                  <strong>Duración:</strong> {c.duracionMin} min
                </p>
                {c.notas && (
                  <p className={styles.notas}>
                    <strong>Notas:</strong> {c.notas}
                  </p>
                )}
              </div>
              <footer className={styles.cardFooter}>
                {c.estado !== "completada" && c.estado !== "cancelada" && (
                  <button
                    className={`${styles.btn} ${styles.btnPrimario}`}
                    onClick={() => marcarCompletada(c.id)}
                  >
                    Marcar atendida
                  </button>
                )}
                {c.estado !== "cancelada" && c.estado !== "completada" && (
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
