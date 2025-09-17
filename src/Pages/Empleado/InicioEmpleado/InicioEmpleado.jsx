import React from "react";
import "./InicioEmpleado.css";

const InicioEmpleado = () => {
  // Datos simulados (luego se conectan a BD o backend en PHP)
  const proximaCita = {
    cliente: "Juan Pérez",
    servicio: "Corte de Cabello",
    hora: "9:00 AM",
  };

  const resumen = {
    citasHoy: 5,
    atendidas: 2,
    pendientes: 3,
  };

  const reporte = {
    totalMes: 42,
    servicioMasSolicitado: "Barba y Estilizado",
    clientesAtendidos: 35,
  };

  return (
    <main className="empleado-dashboard">
      <h1>Bienvenido, Barbero</h1>

      {/* Resumen del día */}
      <section className="dashboard-card">
        <h2>Resumen de Hoy</h2>
        <p><strong>Citas hoy:</strong> {resumen.citasHoy}</p>
        <p><strong>Atendidas:</strong> {resumen.atendidas}</p>
        <p><strong>Pendientes:</strong> {resumen.pendientes}</p>
      </section>

      {/* Próxima cita */}
      <section className="dashboard-card">
        <h2>Próxima Cita</h2>
        <p><strong>Cliente:</strong> {proximaCita.cliente}</p>
        <p><strong>Servicio:</strong> {proximaCita.servicio}</p>
        <p><strong>Hora:</strong> {proximaCita.hora}</p>
        <button>Ver detalles</button>
      </section>

      {/* Reporte personal */}
      <section className="dashboard-card">
        <h2>Reporte Personal</h2>
        <p><strong>Total citas este mes:</strong> {reporte.totalMes}</p>
        <p><strong>Servicio más solicitado:</strong> {reporte.servicioMasSolicitado}</p>
        <p><strong>Clientes atendidos:</strong> {reporte.clientesAtendidos}</p>
      </section>
    </main>
  );
};

export default InicioEmpleado;
