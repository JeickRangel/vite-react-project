// src/components/inicio.jsx
import { useEffect, useMemo, useState } from "react";
import "./inicio.css";
import barberiaAccion from "../../../assets/Barberia-en-accion.png";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

//const API_BASE = "http://localhost/barberia_app/php";

const API_BASE = API_BASE;
const EP = { reservas: `${API_BASE}/reservas.php` };

export default function Inicio({ currentUserId: currentUserIdProp }) {
  const navigate = useNavigate();

  // Sesión: usa la prop si viene; si no, intenta leer desde localStorage (mismo patrón que Reservar/MisCitas)
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

  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fmtFecha = (iso) => {
    if (!iso) return "";
    const d = new Date(iso.replace(" ", "T"));
    return d.toLocaleDateString("es-CO");
  };

  useEffect(() => {
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
        const res = await fetch(`${EP.reservas}?` + qs.toString());
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        // Ordena por fecha+hora DESC y toma las últimas 6
        const ordenadas = [...data]
          .sort((a, b) => {
            const da = new Date(`${a.fecha}T${a.hora}`);
            const db = new Date(`${b.fecha}T${b.hora}`);
            return db - da;
          })
          .slice(0, 6);

        setRecientes(ordenadas);
      } catch {
        setMsg("No se pudieron cargar tus recientes.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [currentUserId]);

  const irMisCitas = () => navigate("/Cliente/MisCitas");
  const irReservar = () => navigate("/Cliente/reservar");

  return (
    <div>
      {/* Sección de bienvenida */}
      <section className="bienvenida">
        <h1>¡Qué gusto tenerte aquí!</h1>
        <p>Barbershop</p>
      </section>

      {/* Banner */}
      <section className="banner">
        <img src={barberiaAccion} alt="Barbería-en-acción" />
      </section>

      {/* Recientes */}
      <section className="recientes">
        <div className="recientes-header">
          <h2>Recientes</h2>
          <div className="recientes-acciones">
            <button onClick={irReservar}>Reservar</button>
            <button className="btn-secondary" onClick={irMisCitas}>Ver todas</button>
          </div>
        </div>

        {msg && <p className="recientes-msg">{msg}</p>}

        {loading ? (
          <p>Cargando…</p>
        ) : !currentUserId ? (
          <p>Inicia sesión para ver tu actividad reciente.</p>
        ) : recientes.length === 0 ? (
          <div className="citas-vacio">
            <p>Aún no tienes citas. ¡Agenda tu primera cita!</p>
            <button onClick={irReservar}>Reservar ahora</button>
          </div>
        ) : (
          <div className="citas-grid">
            {recientes.map((cita) => {
              const fechaISO = `${cita.fecha} ${cita.hora}`;
              return (
                <div key={cita.id_reserva} className="cita-card">
                  <h3>{cita.servicio}</h3>
                  <p className="cita-barbero">Barbero: {cita.empleado}</p>
                  <div className="cita-meta">
                    <span>{fmtFecha(fechaISO)}</span>
                    <span>{cita.hora?.slice(0, 5)}</span>
                  </div>
                  {cita.precio && (
                    <span className="cita-precio">
                      ${Number(cita.precio).toLocaleString()}
                    </span>
                  )}
                  <span className={`cita-badge cita-${cita.estado}`}>
                    {cita.estado}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
