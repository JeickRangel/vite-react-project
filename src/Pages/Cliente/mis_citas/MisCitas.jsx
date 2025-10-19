// src/components/MisCitas.jsx
import { useEffect, useState } from "react";
import "./MisCitas.css";

const API = "http://localhost/barberia_api"; // ajusta a tu ruta real

export default function MisCitas({ currentUserId }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/reservas.php?cliente_id=${currentUserId}`);
      const data = await res.json();
      setCitas(data);
    } catch (e) {
      setMsg("Error cargando tus citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (currentUserId) cargar(); }, [currentUserId]);

  const cancelar = async (id_reserva) => {
    setMsg("");
    try {
      const res = await fetch(`${API}/reservas.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_reserva, estado: "cancelada" }),
      });
      const data = await res.json();
      if (data.status !== "OK") throw new Error(data.message || "Error");
      setMsg("Reserva cancelada");
      cargar();
    } catch (e) {
      setMsg("No se pudo cancelar: " + e.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta reserva?")) return;
    try {
      const res = await fetch(`${API}/reservas.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.status !== "OK") throw new Error(data.message || "Error");
      setMsg("Reserva eliminada");
      cargar();
    } catch (e) {
      setMsg("No se pudo eliminar: " + e.message);
    }
  };

  return (
    <main className="mis-citas-contenedor">
      <h1>Mis Citas</h1>
      {loading && <p>Cargando…</p>}
      {msg && <p>{msg}</p>}
      {!loading && citas.length === 0 && <p>No tienes citas.</p>}

      <div className="mis-grid-citas">
        {citas.map((cita) => (
          <div key={cita.id_reserva} className="mis-cita-card">
            <h3>Servicio: {cita.servicio}</h3>
            <p><strong>Barbero:</strong> {cita.empleado}</p>
            <p><strong>Fecha:</strong> {cita.fecha}</p>
            <p><strong>Hora:</strong> {cita.hora?.slice(0,5)}</p>
            <p><strong>Estado:</strong> {cita.estado}</p>

            <div className="mis-actions">
              {cita.estado !== "cancelada" && (
                <button onClick={() => cancelar(cita.id_reserva)}>Cancelar</button>
              )}
              <button className="danger" onClick={() => eliminar(cita.id_reserva)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
