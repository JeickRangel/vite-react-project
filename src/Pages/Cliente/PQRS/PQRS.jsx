// src/components/PQRS.jsx
import { useEffect, useMemo, useState } from "react";
import "./PQRS.css";
import { API_BASE } from "/src/config/api";

//const API_BASE = "http://localhost/barberia_app/php";


const EP = { pqrs: `${API_BASE}/pqrs.php` };

export default function PQRS({ currentUserId: currentUserIdProp }) {
  // Sesión: usa prop si viene; si no, intenta leer storage (mismo patrón que Reservar/MisCitas)
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

  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    prioridad: "media", // opcional
  });
  const [msg, setMsg] = useState("");
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helpers
  const fmtFecha = (iso) => {
    if (!iso) return "";
    const d = new Date(iso.replace(" ", "T"));
    return d.toLocaleDateString("es-CO");
  };
  const badge = (estado) => {
    const cls =
      estado === "pendiente"
        ? "estado estado-1"
        : estado === "en_proceso"
        ? "estado estado-2"
        : estado === "resuelta"
        ? "estado estado-3"
        : estado === "cerrada"
        ? "estado estado-4"
        : "estado";
    return <span className={cls}>{String(estado || "").replace("_", " ")}</span>;
  };

  // Cargar mis PQRS
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
      const res = await fetch(`${EP.pqrs}?` + qs.toString());
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor");
      setLista(data);
    } catch (e) {
      setMsg("No se pudieron cargar tus PQRS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar(); // eslint-disable-next-line
  }, [currentUserId]);

  // Form
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setMsg("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!currentUserId) {
      setMsg("No hay sesión de usuario.");
      return;
    }
    try {
      const res = await fetch(EP.pqrs, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: Number(currentUserId),
          tipo: form.tipo,
          descripcion: form.descripcion,
          prioridad: form.prioridad, // opcional: 'baja' | 'media' | 'alta'
          canal: "web",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "No se pudo registrar tu PQRS");

      setMsg("✅ PQRS enviado. ID: " + data.id);
      setForm({ tipo: "", descripcion: "", prioridad: "media" });
      cargar();
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <main className="pqrs-contenedor">
      <h1>¿Peticiones, Quejas, Reclamos o Sugerencias?</h1>
      <p className="intro">¿Tienes algún PQRS? Déjanos tu mensaje y pronto te contactaremos.</p>

      {!currentUserId && <p className="pqrs-ayuda">No hay sesión de usuario.</p>}
      {msg && <p className="pqrs-msg">{msg}</p>}

      <div className="pqrs-grid">
        {/* Formulario PQRS */}
        <div className="pqrs-form">
          <form onSubmit={onSubmit}>
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" value={form.tipo} onChange={onChange} required>
              <option value="">Selecciona una opción</option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
            </select>

            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              name="prioridad"
              value={form.prioridad}
              onChange={onChange}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>

            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              placeholder="Escribe tu mensaje..."
              value={form.descripcion}
              onChange={onChange}
              required
            />

            <button type="submit" disabled={!currentUserId || !form.tipo || !form.descripcion}>
              Enviar PQRS
            </button>
          </form>
        </div>

        {/* Lista de PQRS del usuario */}
        <div className="pqrs-lista">
          <h2>Mis PQRS</h2>
          {loading ? (
            <p>Cargando…</p>
          ) : lista.length === 0 ? (
            <p>No has registrado PQRS aún.</p>
          ) : (
            <ul>
              {lista.map((item) => (
                <li key={item.id_pqrs}>
                  <span className="tipo">{item.tipo}</span>
                  <p className="texto">{item.descripcion}</p>
                  <span className="fecha">{fmtFecha(item.created_at)}</span>
                  {badge(item.estado)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
