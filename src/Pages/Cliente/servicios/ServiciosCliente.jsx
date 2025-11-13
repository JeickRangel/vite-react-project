// src/components/ServiciosCliente.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // si no usas router, puedes quitarlo
import styles from "./ServiciosCliente.module.css";
import { API_BASE } from "../config/api";

// MISMA BASE que usas en reservar.jsx
//const API_BASE = "http://localhost/barberia_app/php";
const API_BASE = API_BASE;
const EP = {
  servicios: `${API_BASE}/servicios.php`,
};

function money(value) {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

const ServiciosCliente = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(EP.servicios);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor");
        setServicios(data); // espera campos: id_servicio, nombre, descripcion, precio, duracion
      } catch (e) {
        setMsg("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const irAReservar = (id_servicio) => {
    // si quieres preseleccionar servicio en la pantalla de reserva:
    navigate(`/Cliente/reservar?servicio_id=${id_servicio}`);
  };

  return (
    <main className={styles.serviciosContenedor}>
      <h1>Servicios Disponibles</h1>

      {msg && <p style={{ marginBottom: ".75rem" }}>{msg}</p>}
      {loading ? (
        <p>Cargando servicios…</p>
      ) : servicios.length === 0 ? (
        <p>No hay servicios disponibles por ahora.</p>
      ) : (
        <div className={styles.gridServicios}>
          {servicios.map((s) => (
            <div key={s.id_servicio} className={styles.servicioCard}>
              <h3>{s.nombre}</h3>
              {s.duracion ? <small style={{ color: "#666" }}>{s.duracion} min</small> : null}
              <p>{s.descripcion}</p>
              <span className={styles.precio}>{money(s.precio)}</span>

<div className={styles.actions}>
  <button
    type="button"
    className={styles.btnReservar}
    onClick={() => irAReservar(s.id_servicio)}
  >
    Reservar
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ServiciosCliente;
