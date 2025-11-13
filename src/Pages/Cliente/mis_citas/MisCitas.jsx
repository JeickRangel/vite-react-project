// src/components/MisCitas.jsx
import { useEffect, useMemo, useState } from "react";
import "./MisCitas.css";
import { API_BASE } from "../config/api";

// misma base que usar en reservar.jsx
//const API_BASE = "http://localhost/barberia_app/php";
const API_BASE = API_BASE;
const EP = {
  reservas: `${API_BASE}/reservas.php`,
};

export default function MisCitas({ currentUserId: currentUserIdProp }) {
  // fallback si no te pasan la prop
  const currentUserId = useMemo(() => {
    if (currentUserIdProp) return currentUserIdProp;
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
  }, [currentUserIdProp]);

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtros, setFiltros] = useState({
    estado: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const cargar = async () => {
    if (!currentUserId) {
      setLoading(false);
      setMsg("No hay sesión de usuario.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const qs = new URLSearchParams({ cliente_id: currentUserId });
      if (filtros.estado) qs.append("estado", filtros.estado);
      if (filtros.fecha_inicio && filtros.fecha_fin) {
        qs.append("fecha_inicio", filtros.fecha_inicio);
        qs.append("fecha_fin", filtros.fecha_fin);
      }
      const res = await fetch(`${EP.reservas}?` + qs.toString());
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");
      setCitas(data);
    } catch (e) {
      setMsg("Error cargando tus citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [currentUserId]);

  const onFiltrar = (e) => {
    e.preventDefault();
    cargar();
  };

  const cancelar = async (id_reserva) => {
    try {
      const r = await fetch(EP.reservas, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_reserva, estado: "cancelada" }),
      });
      const data = await r.json();
      if (data.status !== "OK") throw new Error(data.message || "Error");
      setMsg("✅ Cita cancelada");
      cargar();
    } catch (e) {
      setMsg("❌ No se pudo cancelar");
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta reserva?")) return;
    try {
      const r = await fetch(EP.reservas, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await r.json();
      if (data.status !== "OK") throw new Error(data.message || "Error");
      setMsg("🗑️ Cita eliminada");
      setCitas((prev) => prev.filter((c) => Number(c.id_reserva) !== Number(id)));
    } catch (e) {
      setMsg("❌ No se pudo eliminar");
    }
  };

  const fmtHora = (h) => (h?.length >= 5 ? h.slice(0, 5) : h);

  return (
    <main className="mis-citas-contenedor">
      <div className="mis-citas-caja">
        <h1>Mis Citas</h1>

        {!currentUserId && <p className="mis-ayuda">No hay sesión de usuario.</p>}
        {msg && <p className="mis-msg">{msg}</p>}

        {/* Filtros */}
        <form className="mis-filtros" onSubmit={onFiltrar}>
          <div>
            <label>Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros((p) => ({ ...p, estado: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label>Desde</label>
            <input
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => setFiltros((p) => ({ ...p, fecha_inicio: e.target.value }))}
            />
          </div>
          <div>
            <label>Hasta</label>
            <input
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => setFiltros((p) => ({ ...p, fecha_fin: e.target.value }))}
            />
          </div>
          <button type="submit">Aplicar</button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setFiltros({ estado: "", fecha_inicio: "", fecha_fin: "" });
              setTimeout(cargar, 0);
            }}
          >
            Limpiar
          </button>
        </form>

        {/* Lista */}
        {loading ? (
          <p>Cargando…</p>
        ) : citas.length === 0 ? (
          <div className="mis-vacio">
            <p>No tienes citas con los filtros actuales.</p>
          </div>
        ) : (
          <ul className="mis-lista">
            {citas.map((cita) => (
              <li key={cita.id_reserva} className="mis-item">
                <div className="mis-item-main">
                  <div className="mis-item-title">
                    <span className="mis-servicio">{cita.servicio}</span>
                    <span className={`mis-badge mis-${cita.estado}`}>
                      {cita.estado}
                    </span>
                  </div>
                  <div className="mis-item-grid">
                    <p><strong>Barbero:</strong> {cita.empleado}</p>
                    <p><strong>Fecha:</strong> {cita.fecha}</p>
                    <p><strong>Hora:</strong> {fmtHora(cita.hora)}</p>
                    <p><strong>Precio:</strong> ${Number(cita.precio).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mis-actions">
                  {cita.estado !== "cancelada" && (
                    <button onClick={() => cancelar(cita.id_reserva)}>Cancelar</button>
                  )}
                  <button className="danger" onClick={() => eliminar(cita.id_reserva)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
