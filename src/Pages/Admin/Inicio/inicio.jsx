import React from "react";
import { useNavigate } from "react-router-dom";
import "./inicio.css";

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      {/* Bienvenida */}
      <section className="bienvenida">
        <h1>Bienvenido, Administrador 👋</h1>
        <p>
          Este panel te permitirá gestionar de forma web y accesible la lógica
          de tu barbería: administración de citas, servicios, usuarios y PQRS.
        </p>
      </section>

      {/* Accesos rápidos */}
      <section className="accesos-rapidos">
        <h2>Accesos Rápidos</h2>
        <div className="cards-grid">
          <div className="card acceso">
            <h3>📅 Reservas</h3>
            <p>Gestiona y organiza las reservas de los clientes.</p>
            <button onClick={() => navigate("/admin/reservas")}>Ir a Citas</button>
          </div>
          <div className="card acceso">
            <h3>💈 Servicios</h3>
            <p>Administra los servicios disponibles en la barbería.</p>
            <button onClick={() => navigate("/admin/servicios")}>Ir a Servicios</button>
          </div>
          <div className="card acceso">
            <h3>👤 Usuarios</h3>
            <p>Gestiona barberos, clientes y administradores.</p>
            <button onClick={() => navigate("/admin/AdminUsuarios")}>Ir a Usuarios</button>
          </div>
          <div className="card acceso">
            <h3>📨 PQRS</h3>
            <p>Visualiza y responde peticiones, quejas o sugerencias.</p>
            <button onClick={() => navigate("/admin/AdminPQRS")}>Ir a PQRS</button>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="metricas">
        <h2>Métricas Generales</h2>
        <div className="cards-grid">
          <div className="card metrica">
            <h3>150</h3>
            <p>Citas agendadas este mes</p>
          </div>
          <div className="card metrica">
            <h3>12</h3>
            <p>Servicios activos</p>
          </div>
          <div className="card metrica">
            <h3>45</h3>
            <p>Usuarios registrados</p>
          </div>
          <div className="card metrica">
            <h3>8</h3>
            <p>PQRS pendientes</p>
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section className="novedades">
        <h2>Últimas Novedades</h2>
        <ul>
          <li>✨ Nuevo servicio agregado: Corte + Barba Premium.</li>
          <li>📅 Se actualizaron los horarios de atención.</li>
          <li>🔔 3 PQRS recibidas en las últimas 24h.</li>
        </ul>
      </section>
    </div>
  );
};

export default Inicio;
