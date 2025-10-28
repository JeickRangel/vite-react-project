// src/components/AdminPQRS.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./AdminPQRS.css";

/* ===== API ===== */
const API_BASE = "http://localhost/barberia_app/php";
const EP = { pqrs: `${API_BASE}/pqrs.php` };

/* ===== Utils ===== */
const fmtFecha = (isoLike) => {
  if (!isoLike) return "—";
  // admite "YYYY-MM-DD HH:MM:SS" o "YYYY-MM-DDTHH:MM:SS"
  const iso = isoLike.includes("T") ? isoLike : isoLike.replace(" ", "T");
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleString("es-CO");
};

export default function AdminPQRS() {
  /* ===== State ===== */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // filtros UI
  const [q, setQ] = useState("");
  const [fTipo, setFTipo] = useState("todos");        // Petición|Queja|Reclamo|Sugerencia
  const [fEstado, setFEstado] = useState("todos");    // pendiente|en_proceso|resuelta|cerrada
  const [fPrioridad, setFPrioridad] = useState("todas"); // baja|media|alta

  // modal detalle
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);

  /* ===== Cargar listado ===== */
  const cargar = async () => {
    setLoading(true);
    setMsg("");
    try {
      const qs = new URLSearchParams();
      // Si más adelante agregas filtros server-side, agrégalos aquí:
      // if (fEstado !== "todos") qs.append("estado", fEstado); etc.
      const res = await fetch(`${EP.pqrs}?` + qs.toString());
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");
      // normalizar
      const norm = data.map((r) => ({
        id: Number(r.id_pqrs ?? r.id ?? 0),
        clienteId: r.cliente_id ?? null,
        nombre:
          r.cliente_nombre ??
          r.cliente ??
          (r.cliente_id ? `Cliente #${r.cliente_id}` : "—"),
        tipo: r.tipo,
        descripcion: r.descripcion,
        estado: r.estado,
        prioridad: r.prioridad,
        canal: r.canal ?? "web",
        creado: r.created_at ?? r.fecha_creacion ?? r.fecha ?? null,
        actualizado: r.updated_at ?? r.fecha_actualizacion ?? null,
        adjunto: r.adjunto_url ?? null,
      }));
      setItems(norm);
    } catch (e) {
      setMsg("No se pudo cargar el listado de PQRS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  /* ===== Filtrado en cliente ===== */
  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items.filter((it) => {
      if (fTipo !== "todos" && it.tipo !== fTipo) return false;
      if (fEstado !== "todos" && it.estado !== fEstado) return false;
      if (fPrioridad !== "todas" && it.prioridad !== fPrioridad) return false;
      if (!qq) return true;
      return (
        (it.nombre || "").toLowerCase().includes(qq) ||
        (it.descripcion || "").toLowerCase().includes(qq) ||
        String(it.id).includes(qq)
      );
    });
  }, [items, q, fTipo, fEstado, fPrioridad]);

  /* ===== Acciones ===== */
  const actualizarCampo = async (id, patch) => {
    try {
      const res = await fetch(EP.pqrs, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_pqrs: id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "Error");
      // Optimismo UI
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
      );
      if (sel?.id === id) setSel((s) => (s ? { ...s, ...patch } : s));
      setMsg("✅ Actualizado");
    } catch (e) {
      setMsg("❌ No se pudo actualizar");
    }
  };

  const onChangeEstado = (id, nuevo) => actualizarCampo(id, { estado: nuevo });
  const onChangePrioridad = (id, nuevo) => actualizarCampo(id, { prioridad: nuevo });

  const resolver = (id) => onChangeEstado(id, "resuelta");
  const cerrar = (id) => onChangeEstado(id, "cerrada");

  const verDetalle = (row) => {
    setSel(row);
    setOpen(true);
  };

  return (
    <div className="pqrs-container">
      <h2>Gestión de PQRS</h2>
      {msg && <p className="pqrs-flash">{msg}</p>}

      {/* Filtros */}
      <div className="pqrs-toolbar">
        <input
          className="pqrs-input"
          placeholder="Buscar por id, cliente o texto…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="pqrs-select" value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
          <option value="todos">Tipo: todos</option>
          <option value="Petición">Petición</option>
          <option value="Queja">Queja</option>
          <option value="Reclamo">Reclamo</option>
          <option value="Sugerencia">Sugerencia</option>
        </select>

        <select className="pqrs-select" value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
          <option value="todos">Estado: todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="resuelta">Resuelta</option>
          <option value="cerrada">Cerrada</option>
        </select>

        <select className="pqrs-select" value={fPrioridad} onChange={(e) => setFPrioridad(e.target.value)}>
          <option value="todas">Prioridad: todas</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>

        <button className="btn-ghost" onClick={cargar}>Recargar</button>
      </div>

      {/* Tabla */}
      <table className="pqrs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Creado</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="pqrs-empty">Cargando…</td></tr>
          ) : filtrados.length === 0 ? (
            <tr><td colSpan="7" className="pqrs-empty">Sin resultados</td></tr>
          ) : (
            filtrados.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td title={r.clienteId ? `ID ${r.clienteId}` : ""}>{r.nombre}</td>
                <td>{r.tipo}</td>
                <td>{fmtFecha(r.creado)}</td>
                <td>
                  <select
                    className={`chip chip-${r.estado}`}
                    value={r.estado}
                    onChange={(e) => onChangeEstado(r.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En_proceso</option>
                    <option value="resuelta">Resuelta</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </td>
                <td>
                  <select
                    className={`chip chip-${r.prioridad}`}
                    value={r.prioridad}
                    onChange={(e) => onChangePrioridad(r.id, e.target.value)}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </td>
                <td className="pqrs-actions">
                  <button className="btn-detalle" onClick={() => verDetalle(r)}>Ver Detalle</button>
                  {r.estado !== "resuelta" && (
                    <button className="btn-ok" onClick={() => resolver(r.id)}>Resolver</button>
                  )}
                  {r.estado !== "cerrada" && (
                    <button className="btn-warn" onClick={() => cerrar(r.id)}>Cerrar</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Detalle */}
      {open && sel && (
        <div className="pqrs-modalBackdrop" onMouseDown={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="pqrs-modal" onMouseDown={(e) => e.stopPropagation()}>
            <header className="pqrs-modalHeader">
              <h3>PQRS #{sel.id}</h3>
              <button className="pqrs-close" onClick={() => setOpen(false)}>✕</button>
            </header>
            <div className="pqrs-modalBody">
              <p><strong>Cliente:</strong> {sel.nombre} {sel.clienteId ? `(ID ${sel.clienteId})` : ""}</p>
              <p><strong>Tipo:</strong> {sel.tipo}</p>
              <p><strong>Canal:</strong> {sel.canal}</p>
              <p><strong>Creado:</strong> {fmtFecha(sel.creado)}</p>
              <p><strong>Actualizado:</strong> {fmtFecha(sel.actualizado)}</p>
              {sel.adjunto && (
                <p><strong>Adjunto:</strong> <a href={sel.adjunto} target="_blank" rel="noreferrer">Ver archivo</a></p>
              )}
              <div className="pqrs-box">
                <div className="pqrs-boxTitle">Descripción</div>
                <div className="pqrs-boxBody">{sel.descripcion || "—"}</div>
              </div>
            </div>
            <footer className="pqrs-modalFooter">
              <label>
                Estado:&nbsp;
                <select value={sel.estado} onChange={(e) => onChangeEstado(sel.id, e.target.value)}>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En_proceso</option>
                  <option value="resuelta">Resuelta</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </label>
              <label>
                Prioridad:&nbsp;
                <select value={sel.prioridad} onChange={(e) => onChangePrioridad(sel.id, e.target.value)}>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </label>
              <button className="btn-ok" onClick={() => resolver(sel.id)}>Resolver</button>
              <button className="btn-warn" onClick={() => cerrar(sel.id)}>Cerrar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
