// src/components/BarberosCliente.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // si no usas router, puedes quitarlo
import styles from "./BarberosCliente.module.css";
import { API_BASE } from "/src/config/api";

// MISMA base que en tus otros módulos
//const API_BASE = "http://localhost/barberia_app/php";

const ROL_BARBERO_ID = 2; // 👈 ajusta si el id del rol "Barbero" es otro

const EP = {
  usuarios: `${API_BASE}/usuarios.php`, // ?rol=2
};

// Utilidad: avatar con iniciales si no hay foto
function InitialsAvatar({ name }) {
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div className={styles.avatarFallback} aria-label={name}>
      {initials || "B"}
    </div>
  );
}

export default function BarberosCliente() {
  const navigate = useNavigate();
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(`${EP.usuarios}?rol=${ROL_BARBERO_ID}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        // Normaliza a { id, nombre, especialidad?, foto_url? }
        const list = data.map((u) => ({
          id: u.id,
          nombre: u.nombre,
          especialidad: u.especialidad || "Cortes y barbería",
          foto_url: u.foto_url || null, // por si en el futuro agregas columna
        }));
        setBarberos(list);
      } catch (e) {
        setMsg("No se pudieron cargar los barberos.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const verDisponibilidad = (barberoId) => {
    // Llévalo a reservar con el barbero preseleccionado
    navigate(`/Cliente/reservar?empleado_id=${barberoId}`);
  };

  return (
    <main className={styles.barberosContenedor}>
      <h1>Nuestros Barberos</h1>

      {msg && <p style={{ marginBottom: ".75rem" }}>{msg}</p>}

      {loading ? (
        <p>Cargando barberos…</p>
      ) : barberos.length === 0 ? (
        <p>No hay barberos activos por ahora.</p>
      ) : (
        <div className={styles.gridBarberos}>
          {barberos.map((b) => (
            <div key={b.id} className={styles.barberoCard}>
              {/* Foto si existe, si no avatar con iniciales */}
              {b.foto_url ? (
                <img src={b.foto_url} alt={b.nombre} className={styles.barberoImg} />
              ) : (
                <InitialsAvatar name={b.nombre} />
              )}

              <h3>{b.nombre}</h3>
              <p className={styles.especialidad}>Especialidad: {b.especialidad}</p>
              <button onClick={() => verDisponibilidad(b.id)}>Ver disponibilidad</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
