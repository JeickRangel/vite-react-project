import React, { useMemo, useState, useEffect } from "react";
import styles from "./ClientesEmpleado.module.css";

// Utils
const limpiar = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const onlyDigits = (s = "") => s.replace(/\D/g, "");
const waUrl = (tel) => `https://wa.me/${onlyDigits(tel)}`;
const telUrl = (tel) => `tel:${onlyDigits(tel)}`;
const fmtFecha = (iso) =>
  new Date(iso).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Modal simple, accesible
function Modal({ open, onClose, children, title = "Detalle" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">✕</button>
        </header>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

export default function ClientesEmpleado() {
  // Datos mock
  const [clientes] = useState([
    { id: 1, nombre: "Luis Romero", telefono: "3001234567", email: "luis@example.com", ultimaVisitaISO: "2025-09-10T09:30:00", preferencias: "Degradado medio", notas: "Trae referencia" },
    { id: 2, nombre: "Camilo Díaz", telefono: "3015558888", email: "camilo@example.com", ultimaVisitaISO: "2025-08-30T16:00:00", preferencias: "", notas: "" },
    { id: 3, nombre: "Andrés Pérez", telefono: "3029991122", email: "", ultimaVisitaISO: "2025-09-01T11:00:00", preferencias: "Piel sensible", notas: "" },
    { id: 4, nombre: "Juanita Rodríguez", telefono: "3047770000", email: "juani@example.com", ultimaVisitaISO: "2025-09-12T10:30:00", preferencias: "", notas: "Prefiere tijera" },
    { id: 5, nombre: "Carlos Gómez", telefono: "3156667788", email: "", ultimaVisitaISO: "2025-07-25T15:00:00", preferencias: "Barba perfilada", notas: "" },
    { id: 6, nombre: "Ana María", telefono: "3112223344", email: "ana@example.com", ultimaVisitaISO: "2025-06-15T10:00:00", preferencias: "", notas: "" },
    { id: 7, nombre: "Pedro Páramo", telefono: "3000000000", email: "", ultimaVisitaISO: "2025-09-05T13:00:00", preferencias: "", notas: "" },
  ]);

  // Control lista
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  // Modal/Detalle (solo front)
  const [abierto, setAbierto] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [notaNueva, setNotaNueva] = useState("");

  // Historial simulado por cliente (en real, lo traerías por id)
  const historialDemo = [
    { id: 101, fechaISO: "2025-09-12T10:30:00", servicio: "Corte clásico", barbero: "Carlos", estado: "completada" },
    { id: 102, fechaISO: "2025-08-30T16:00:00", servicio: "Afeitado", barbero: "Andrés", estado: "completada" },
    { id: 103, fechaISO: "2025-07-25T15:00:00", servicio: "Corte + Cejas", barbero: "Carlos", estado: "cancelada" },
  ];

  const filtrados = useMemo(() => {
    const q = limpiar(busqueda);
    return clientes
      .filter(c =>
        !q ||
        limpiar(c.nombre).includes(q) ||
        onlyDigits(c.telefono || "").includes(onlyDigits(busqueda))
      )
      .sort((a, b) => new Date(b.ultimaVisitaISO) - new Date(a.ultimaVisitaISO));
  }, [clientes, busqueda]);

  const total = filtrados.length;
  const totalPag = Math.max(1, Math.ceil(total / porPagina));
  const inicio = (pagina - 1) * porPagina;
  const paginaActual = filtrados.slice(inicio, inicio + porPagina);

  useEffect(() => { setPagina(1); }, [busqueda]);

  const abrirDetalle = (c) => {
    // clonamos para editar local sin tocar la lista
    setDetalle({ ...c });
    setNotaNueva("");
    setAbierto(true);
  };

  const guardarDatosBasicos = () => {
    alert("Datos actualizados (solo UI). Luego esto hará fetch al backend.");
  };

  const agregarNota = () => {
    if (!notaNueva.trim()) return;
    const nueva = `${new Date().toLocaleString("es-CO")}: ${notaNueva}`;
    setDetalle(prev => ({ ...prev, notas: (prev.notas ? prev.notas + "\n" : "") + nueva }));
    setNotaNueva("");
  };

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h2>Clientes</h2>
        <p>{total} resultado(s)</p>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder="Buscar por nombre o teléfono…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla (desktop) */}
      <div className={styles.tablaWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Última visita</th>
              <th className={styles.colAcciones}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginaActual.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.vacio}>No hay clientes para los filtros.</td>
              </tr>
            ) : paginaActual.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className={styles.clienteCell}>
                    <div className={styles.avatar}>{(c.nombre || "?").charAt(0)}</div>
                    <div>
                      <div className={styles.nombre}>{c.nombre}</div>
                      {c.preferencias && <div className={styles.mini}>{c.preferencias}</div>}
                    </div>
                  </div>
                </td>
                <td className={styles.mono}>{c.telefono || "—"}</td>
                <td className={styles.mono}>{c.email || "—"}</td>
                <td>{c.ultimaVisitaISO ? fmtFecha(c.ultimaVisitaISO) : "—"}</td>
                <td className={styles.acciones}>
                  <a className={`${styles.btn} ${styles.btnSec}`} href={telUrl(c.telefono)}>Llamar</a>
                  <a className={`${styles.btn} ${styles.btnSec}`} href={waUrl(c.telefono)} target="_blank" rel="noreferrer">WhatsApp</a>
                  <button className={`${styles.btn} ${styles.btnPrim}`} onClick={() => abrirDetalle(c)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className={styles.paginacion}>
        <button className={styles.pagBtn} disabled={pagina <= 1} onClick={() => setPagina(p => Math.max(1, p - 1))}>Anterior</button>
        <span className={styles.pagInfo}>Página {pagina} de {totalPag}</span>
        <button className={styles.pagBtn} disabled={pagina >= totalPag} onClick={() => setPagina(p => Math.min(totalPag, p + 1))}>Siguiente</button>
      </div>

      {/* Cards (móvil) */}
      <div className={styles.cards}>
        {paginaActual.length === 0 ? (
          <div className={styles.cardVacio}>No hay clientes para los filtros.</div>
        ) : paginaActual.map(c => (
          <article key={c.id} className={styles.card}>
            <header className={styles.cardHeader}>
              <div className={styles.avatarLg}>{(c.nombre || "?").charAt(0)}</div>
              <div className={styles.cardTitle}>
                <h4 className={styles.nombre}>{c.nombre}</h4>
                {c.preferencias && <div className={styles.mini}>{c.preferencias}</div>}
              </div>
            </header>
            <div className={styles.cardBody}>
              <p><strong>Teléfono:</strong> <span className={styles.mono}>{c.telefono || "—"}</span></p>
              <p><strong>Email:</strong> <span className={styles.mono}>{c.email || "—"}</span></p>
              <p><strong>Última visita:</strong> {c.ultimaVisitaISO ? fmtFecha(c.ultimaVisitaISO) : "—"}</p>
            </div>
            <footer className={styles.cardFooter}>
              <a className={`${styles.btn} ${styles.btnSec}`} href={telUrl(c.telefono)}>Llamar</a>
              <a className={`${styles.btn} ${styles.btnSec}`} href={waUrl(c.telefono)} target="_blank" rel="noreferrer">WhatsApp</a>
              <button className={`${styles.btn} ${styles.btnPrim}`} onClick={() => abrirDetalle(c)}>Ver</button>
            </footer>
          </article>
        ))}
      </div>

      {/* Modal de detalle */}
      <Modal open={abierto} onClose={() => setAbierto(false)} title="Detalle del cliente">
        {detalle && (
          <div className={styles.detalle}>
            <div className={styles.detalleHeader}>
              <div className={styles.avatarLg}>{(detalle.nombre || "?").charAt(0)}</div>
              <div>
                <h4 className={styles.nombre} style={{ margin: 0 }}>{detalle.nombre}</h4>
                {detalle.preferencias && <div className={styles.mini}>Preferencias: {detalle.preferencias}</div>}
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.panel}>
                <h5>Contacto</h5>
                <div className={styles.field}>
                  <label>Teléfono</label>
                  <input value={detalle.telefono} onChange={(e) => setDetalle({ ...detalle, telefono: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <input value={detalle.email || ""} onChange={(e) => setDetalle({ ...detalle, email: e.target.value })} />
                </div>
                <div className={styles.actionsRow}>
                  <a className={`${styles.btn} ${styles.btnSec}`} href={telUrl(detalle.telefono)}>Llamar</a>
                  <a className={`${styles.btn} ${styles.btnSec}`} href={waUrl(detalle.telefono)} target="_blank" rel="noreferrer">WhatsApp</a>
                  <button className={`${styles.btn} ${styles.btnPrim}`} onClick={guardarDatosBasicos}>Guardar</button>
                </div>
              </div>

              <div className={styles.panel}>
                <h5>Notas internas</h5>
                <textarea
                  className={styles.textarea}
                  rows={6}
                  value={detalle.notas || ""}
                  onChange={(e) => setDetalle({ ...detalle, notas: e.target.value })}
                />
                <div className={styles.nuevaNotaRow}>
                  <input
                    className={styles.input}
                    placeholder="Agregar nota rápida…"
                    value={notaNueva}
                    onChange={(e) => setNotaNueva(e.target.value)}
                  />
                  <button className={`${styles.btn} ${styles.btnPrim}`} onClick={agregarNota}>Agregar</button>
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h5>Historial (demo)</h5>
              <div className={styles.tableWrap}>
                <table className={styles.tablaHist}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Servicio</th>
                      <th>Barbero</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialDemo.length === 0 ? (
                      <tr><td colSpan="4" className={styles.vacio}>Sin registros</td></tr>
                    ) : historialDemo.map(h => (
                      <tr key={h.id}>
                        <td>{fmtFecha(h.fechaISO)}</td>
                        <td>{h.servicio}</td>
                        <td>{h.barbero}</td>
                        <td><span className={`${styles.badge} ${styles[`estado_${h.estado}`]}`}>{h.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
