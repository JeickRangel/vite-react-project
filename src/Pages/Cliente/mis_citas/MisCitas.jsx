import React from "react";
import "./MisCitas.css"; // estilos específicos solo para este módulo

export default function MisCitas() {
  // Más adelante puedes traer las citas dinámicamente desde la BD
  const citas = [
    {
      id: 1,
      servicio: "Corte de Cabello",
      barbero: "Diana Pérez",
      fecha: "15/05/2025",
      hora: "10:00 AM",
    },
    {
      id: 2,
      servicio: "Barba y Estilizado",
      barbero: "Luis Ramírez",
      fecha: "20/05/2025",
      hora: "2:00 PM",
    },
  ];

  return (
    <main className="mis-citas-contenedor">
      <h1>Mis Citas</h1>
      <div className="mis-grid-citas">
        {citas.map((cita) => (
          <div key={cita.id} className="mis-cita-card">
            <h3>Servicio: {cita.servicio}</h3>
            <p>
              <strong>Barbero:</strong> {cita.barbero}
            </p>
            <p>
              <strong>Fecha:</strong> {cita.fecha}
            </p>
            <p>
              <strong>Hora:</strong> {cita.hora}
            </p>
            <button>Ver detalles</button>
          </div>
        ))}
      </div>
    </main>
  );
}
