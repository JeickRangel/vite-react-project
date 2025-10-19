// src/components/reservar.jsx
import { useEffect, useMemo, useState } from "react";
import "./reservar.css";

// Base de carpeta del backend
const API_BASE = "http://localhost/barberia_app/php";
const ROL_BARBERO_ID = 2; // ajusta si tu rol "Barbero" tiene otro id

const EP = {
  servicios: `${API_BASE}/servicios.php`,
  usuarios:  `${API_BASE}/usuarios.php`,
  horarios:  `${API_BASE}/horarios_disponibles.php`,
  reservas:  `${API_BASE}/reservas.php`,
};

export default function Reservar({ currentUserId: currentUserIdProp }) {
  // Fallback: intenta sacar el id desde localStorage si no vino por props
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

  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    servicio_id: "",
    empleado_id: "",
    fecha: "",
    hora: "", // "HH:MM:00"
  });

  // Cargar servicios + barberos
  useEffect(() => {
    const cargar = async () => {
      try {
        const [svRes, bbRes] = await Promise.all([
          fetch(EP.servicios),
          fetch(`${EP.usuarios}?rol=${ROL_BARBERO_ID}`),
        ]);
        const [svData, bbData] = await Promise.all([svRes.json(), bbRes.json()]);

        setServicios(Array.isArray(svData) ? svData : []);

        const barberosLimpios = (Array.isArray(bbData) ? bbData : []).map((u) => ({
          id: u.id,
          nombre: u.nombre,
        }));
        setBarberos(barberosLimpios);
      } catch {
        setMsg("Error cargando servicios o barberos");
      }
    };
    cargar();
  }, []);

  // Cargar horarios disponibles cuando hay servicio+barbero+fecha
  useEffect(() => {
    const { servicio_id, empleado_id, fecha } = form;
    if (!servicio_id || !empleado_id || !fecha) {
      setTurnos([]);
      return;
    }
    const cargarTurnos = async () => {
      try {
        setLoadingTurnos(true);
        const qs = new URLSearchParams({ servicio_id, empleado_id, fecha });
        const res = await fetch(`${EP.horarios}?` + qs.toString());
        const data = await res.json(); // ["HH:MM", ...] o ["HH:MM:SS", ...]
        // normaliza a "HH:MM:00"
        const normalizados = Array.isArray(data)
          ? data.map((h) => (h.length === 5 ? `${h}:00` : h))
          : [];
        setTurnos(normalizados);
      } catch {
        setMsg("No se pudieron obtener turnos");
      } finally {
        setLoadingTurnos(false);
      }
    };
    cargarTurnos();
  }, [form.servicio_id, form.empleado_id, form.fecha]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value, ...(name !== "hora" ? { hora: "" } : {}) }));
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
      const res = await fetch(EP.reservas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: Number(currentUserId),         // 👈 id del usuario logueado
          empleado_id: Number(form.empleado_id),
          servicio_id: Number(form.servicio_id),
          fecha: form.fecha,
          hora: form.hora,                           // "HH:MM:00"
        }),
      });

      // Debug útil por si falla algo en el backend
      // console.log("status", res.status);
      const data = await res.json();
      // console.log("data", data);

      if (!res.ok || data.status !== "OK") {
        throw new Error(data.message || "No se pudo crear la reserva");
      }

      setMsg("✅ Reserva creada. ID: " + data.id);
      setTurnos((prev) => prev.filter((h) => h !== form.hora)); // quita hora tomada
      setForm((p) => ({ ...p, hora: "" }));
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <main className="reservar-contenedor">
      <div className="reservar-caja">
        <h2>Reserva tu cita</h2>

        {/* Muestra aviso si no hay sesión */}
        {!currentUserId && (
          <p className="reservar-ayuda">No hay sesión de usuario.</p>
        )}
        {msg && <p className="reservar-msg">{msg}</p>}

        <form onSubmit={onSubmit}>
          {/* Servicio */}
          <label htmlFor="servicio_id">Servicio</label>
          <select
            id="servicio_id"
            name="servicio_id"
            value={form.servicio_id}
            onChange={onChange}
            required
          >
            <option value="">Elige un servicio</option>
            {servicios.map((s) => (
              <option key={s.id_servicio} value={s.id_servicio}>
                {s.nombre} {s.duracion ? `(${s.duracion} min)` : ""}
              </option>
            ))}
          </select>

          {/* Barbero */}
          <label htmlFor="empleado_id">Barbero</label>
          <select
            id="empleado_id"
            name="empleado_id"
            value={form.empleado_id}
            onChange={onChange}
            required
          >
            <option value="">Elige un barbero</option>
            {barberos.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>

          {/* Fecha */}
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={form.fecha}
            onChange={onChange}
            required
          />

          {/* Hora (lista) */}
          <label htmlFor="hora">Hora</label>
          {loadingTurnos ? (
            <div className="reservar-ayuda">Cargando turnos…</div>
          ) : (
            <select
              id="hora"
              name="hora"
              value={form.hora}
              onChange={onChange}
              required
              disabled={turnos.length === 0}
            >
              <option value="">{turnos.length ? "Elige una hora" : "Sin horarios"}</option>
              {turnos.map((h) => (
                <option key={h} value={h}>
                  {h.slice(0, 5)}
                </option>
              ))}
            </select>
          )}
          {form.hora && <small>Seleccionaste {form.hora.slice(0, 5)}</small>}

          <button
            type="submit"
            disabled={
              !currentUserId ||
              !form.servicio_id ||
              !form.empleado_id ||
              !form.fecha ||
              !form.hora
            }
          >
            Confirmar cita
          </button>
        </form>
      </div>
    </main>
  );
}
