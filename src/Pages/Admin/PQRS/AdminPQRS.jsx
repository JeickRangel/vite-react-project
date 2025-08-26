import React, { useState } from "react";
import "./AdminPQRS.css";

export default function AdminPQRS() {
  // Datos de prueba
  const [pqrsList] = useState([
    {
      id: 1,
      nombre: "Carlos López",
      tipo: "Petición",
      fecha: "2025-08-20",
      estado: "Pendiente",
      prioridad: "Alta",
      mensaje: "¿Pueden agregar más horarios los domingos?"
    },
    {
      id: 2,
      nombre: "María Gómez",
      tipo: "Queja",
      fecha: "2025-08-22",
      estado: "Resuelto",
      prioridad: "Media",
      mensaje: "El barbero llegó tarde a mi cita."
    },
    {
      id: 3,
      nombre: "Andrés Ruiz",
      tipo: "Sugerencia",
      fecha: "2025-08-23",
      estado: "En proceso",
      prioridad: "Baja",
      mensaje: "Sería genial tener una app para agendar citas."
    }
  ]);

  return (
    <div className="pqrs-container">
      <h2>Gestión de PQRS</h2>
      <table className="pqrs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pqrsList.map((pqrs) => (
            <tr key={pqrs.id}>
              <td>{pqrs.id}</td>
              <td>{pqrs.nombre}</td>
              <td>{pqrs.tipo}</td>
              <td>{pqrs.fecha}</td>
              <td>{pqrs.estado}</td>
              <td>{pqrs.prioridad}</td>
              <td>
                <button className="btn-detalle">Ver Detalle</button>
                <button className="btn-resolver">Resolver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
