// src/components/ClientesEmpleado.jsx
import React, { useMemo, useState, useEffect } from "react";
import styles from "./ClientesEmpleado.module.css";
import { API_BASE } from "/src/config/api";

/* ================== CONFIG API ================== */
//const API_BASE = "http://localhost/barberia_app/php";

const EP = {
  usuarios: `${API_BASE}/usuarios.php`,
  reservas: `${API_BASE}/reservas.php`,
};
const ROL_CLIENTE_ID = 3; // 👈 ajusta si tu rol "Cliente" tiene otro id

/* ================== UTILS ================== */
const limpiar = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const onlyDigits = (s = "") => s.replace(/\D/g, "");
const waUrl = (tel) => `https://wa.me/${onlyDigits(tel)}`;
const telUrl = (tel) => `tel:${onlyDigits(tel)}`;
const fmtFecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Modal simple y accesible
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

export default function ClientesEmpleado({ currentEmployeeId: currentEmployeeIdProp }) {
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
  const [clientes, setClientes] = useState([]);     // lista cruzada usuarios + última visita
  const [historialAll, setHistorialAll] = useState([]); // reservas del empleado (para historiales y última visita)
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Control lista
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  // Modal/Detalle
  const [abierto, setAbierto] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [notaNueva, setNotaNueva] = useState("");

  /* ===== Carga de datos ===== */
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setMsg("");
      try {
        // 1) Usuarios (clientes)
        const uRes = await fetch(`${EP.usuarios}?rol=${ROL_CLIENTE_ID}`);
        const usuarios = await uRes.json();
        if (!Array.isArray(usuarios)) throw new Error("usuarios.php no respondió con lista");

        // 2) Reservas del empleado logueado (para última visita e historial)
        let reservas = [];
        if (empleadoId) {
          const qs = new URLSearchParams({ empleado_id: empleadoId });
          const rRes = await fetch(`${EP.reservas}?` + qs.toString());
          reservas = await rRes.json();
          if (!Array.isArray(reservas)) reservas = [];
        }

        // Mapa de última visita por cliente (match por id si existe en reservas, si no por nombre)
        // NOTA: tu reservas.php actual no trae c.id -> si puedes, añade "c.id AS cliente_id" en el SELECT para evitar ambigüedades.
        const normName = (s) => limpiar(s || "");
        const lastByKey = new Map(); // key = cliente_id (preferente) o nombre normalizado

        for (const r of reservas) {
          const fechaStr = `${r.fecha}T${(r.hora || "00:00:00").slice(0, 8)}`;
          const dt = new Date(fechaStr);
          const key =
            // usa id si te llega desde backend (recomendado)
            (r.cliente_id != null ? `id:${r.cliente_id}` : `name:${normName(r.cliente)}`);

          const prev = lastByKey.get(key);
          if (!prev || dt > prev) lastByKey.set(key, dt);
        }

        // Armar lista de clientes enriquecida
        const enriquecidos = usuarios.map((u) => {
          const kById = `id:${u.id}`;
          const kByName = `name:${normName(u.nombre)}`;
          const last =
            lastByKey.get(kById) ||
            lastByKey.get(kByName) ||
            null;

          return {
            id: u.id,
            nombre: u.nombre,
            telefono: u.telefono || "", // tu usuarios.php no trae telefono por defecto; quedará vacío.
            email: u.correo || "",
            preferencias: "",            // si en el futuro agregas campo, lo mapeas aquí
            notas: "",                   // idem
            ultimaVisitaISO: last ? last.toISOString() : null,
          };
        });

        setClientes(enriquecidos);
        setHistorialAll(reservas);
      } catch (e) {
        setMsg("No se pudo cargar la lista de clientes.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [empleadoId]);

  /* ===== Filtros y paginación ===== */
  const filtrados = useMemo(() => {
    const q = limpiar(busqueda);
    return clientes
      .filter((c) =>
        !q ||
        limpiar(c.nombre).includes(q) ||
        onlyDigits(c.telefono || "").includes(onlyDigits(busqueda))
      )
      .sort((a, b) => {
        const da = a.ultimaVisitaISO ? new Date(a.ultimaVisitaISO) : 0;
        const db = b.ultimaVisitaISO ? new Date(b.ultimaVisitaISO) : 0;
        return db - da; // más reciente primero
      });
  }, [clientes, busqueda]);

  const total = filtrados.length;
  const totalPag = Math.max(1, Math.ceil(total / porPagina));
  const inicio = (pagina - 1) * porPagina;
  const paginaActual = filtrados.slice(inicio, inicio + porPagina);

  useEffect(() => { setPagina(1); }, [busqueda]);

  /* ===== Modal Detalle ===== */
  const abrirDetalle = (c) => {
    setDetalle({ ...c });
    setNotaNueva("");
    setAbierto(true);
  };

  // Historial real del cliente seleccionado (filtrado desde reservas ya cargadas)
  const historialCliente = useMemo(() => {
    if (!detalle) return [];
    const nameKey = limpiar(detalle.nombre);
    // Si tu reservas.php trae cliente_id, filtra por id en vez de nombre:
    // return historialAll.filter(r => Number(r.cliente_id) === Number(detalle.id));
    return historialAll
      .filter((r) => limpiar(r.cliente) === nameKey)
      .sort((a, b) => {
        const da = new Date(`${a.fecha}T${(a.hora || "00:00:00").slice(0,8)}`);
        const db = new Date(`${b.fecha}T${(b.hora || "00:00:00").slice(0,8)}`);
        return db - da;
      });
  }, [detalle, historialAll]);

  /* ===== Acciones (por ahora solo UI) ===== */
    const guardarDatosBasicos = async () => {
    if (!detalle) return;
    try {
      const payload = {
        id: Number(detalle.id),
        nombre: detalle.nombre,            // mantenemos lo que ya trae
        correo: detalle.email || "",       // backend usa 'correo' como alias de email
        telefono: detalle.telefono || "",  // 👈 nuevo
        genero: null,
        tipo_documento: null,
        numero_documento: null,
        rol: 3, // si tu cliente es rol 3; ajusta si es otro
      };

      const res = await fetch(`${EP.usuarios}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "Error guardando");

      // Reflejar en la lista principal
      setClientes((prev) =>
        prev.map((c) => (c.id === detalle.id ? { ...c, telefono: detalle.telefono, email: detalle.email } : c))
      );

      alert("✅ Datos guardados");
    } catch (e) {
      alert("❌ No se pudo guardar el teléfono/email");
      console.error(e);
    }
  };


  const agregarNota = () => {
    if (!notaNueva.trim()) return;
    const nueva = `${new Date().toLocaleString("es-CO")}: ${notaNueva}`;
    setDetalle((prev) => ({ ...prev, notas: (prev.notas ? prev.notas + "\n" : "") + nueva }));
    setNotaNueva("");
  };

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <h2>Clientes</h2>
        <p>{loading ? "Cargando…" : `${total} resultado(s)`} {msg && <span className={styles.flashMsg}>— {msg}</span>}</p>
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
            {loading ? (
              <tr><td colSpan="5" className={styles.vacio}>Cargando…</td></tr>
            ) : paginaActual.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.vacio}>No hay clientes para los filtros.</td>
              </tr>
            ) : (
              paginaActual.map((c) => (
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
                  <td>{fmtFecha(c.ultimaVisitaISO)}</td>
                  <td className={styles.acciones}>
                    <a className={`${styles.btn} ${styles.btnSec}`} href={telUrl(c.telefono)}>Llamar</a>
                    <a className={`${styles.btn} ${styles.btnSec}`} href={waUrl(c.telefono)} target="_blank" rel="noreferrer">WhatsApp</a>
                    <button className={`${styles.btn} ${styles.btnPrim}`} onClick={() => abrirDetalle(c)}>Ver</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className={styles.paginacion}>
        <button className={styles.pagBtn} disabled={pagina <= 1} onClick={() => setPagina((p) => Math.max(1, p - 1))}>Anterior</button>
        <span className={styles.pagInfo}>Página {pagina} de {totalPag}</span>
        <button className={styles.pagBtn} disabled={pagina >= totalPag} onClick={() => setPagina((p) => Math.min(totalPag, p + 1))}>Siguiente</button>
      </div>

      {/* Cards (móvil) */}
      <div className={styles.cards}>
        {loading ? (
          <div className={styles.cardVacio}>Cargando…</div>
        ) : paginaActual.length === 0 ? (
          <div className={styles.cardVacio}>No hay clientes para los filtros.</div>
        ) : (
          paginaActual.map((c) => (
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
                <p><strong>Última visita:</strong> {fmtFecha(c.ultimaVisitaISO)}</p>
              </div>
              <footer className={styles.cardFooter}>
                <a className={`${styles.btn} ${styles.btnSec}`} href={telUrl(c.telefono)}>Llamar</a>
                <a className={`${styles.btn} ${styles.btnSec}`} href={waUrl(c.telefono)} target="_blank" rel="noreferrer">WhatsApp</a>
                <button className={`${styles.btn} ${styles.btnPrim}`} onClick={() => abrirDetalle(c)}>Ver</button>
              </footer>
            </article>
          ))
        )}
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
                <p className={styles.hint}>
                  (Si quieres guardar notas por cliente, creamos una tabla <code>cliente_notas</code> o un campo en <code>usuarios</code>.)
                </p>
              </div>
            </div>

            <div className={styles.panel}>
              <h5>Historial</h5>
              <div className={styles.tableWrap}>
                <table className={styles.tablaHist}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialCliente.length === 0 ? (
                      <tr><td colSpan="4" className={styles.vacio}>Sin registros</td></tr>
                    ) : historialCliente.map((h, i) => {
                      const iso = `${h.fecha}T${(h.hora || "00:00:00").slice(0,8)}`;
                      return (
                        <tr key={`${h.id_reserva || i}-${iso}`}>
                          <td>{fmtFecha(iso)}</td>
                          <td>{h.servicio}</td>
                          <td><span className={`${styles.badge} ${styles[`estado_${h.estado}`]}`}>{h.estado}</span></td>
                          <td className={styles.mono}>{h.precio ? `$${Number(h.precio).toLocaleString()}` : "—"}</td>
                        </tr>
                      );
                    })}
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
