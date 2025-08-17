import { useState } from "react";
import "./reservas.css";

export default function Reservas() {
  const [reservas, setReservas] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      barbero: "Carlos Gómez",
      servicio: "Corte de cabello",
      fecha: "2025-08-16",
      hora: "10:30 AM",
      estado: "Pendiente",
      telefono: "3001234567",
      correo: "juan@example.com",
    },
    {
      id: 2,
      cliente: "Ana Torres",
      barbero: "Luis Martínez",
      servicio: "Barba + Corte",
      fecha: "2025-08-17",
      hora: "02:00 PM",
      estado: "Confirmada",
      telefono: "3019876543",
      correo: "ana@example.com",
    },
  ]);

  const [filtro, setFiltro] = useState("");
  const [modalDetalle, setModalDetalle] = useState(null); // guarda reserva seleccionada
  const [modalCrear, setModalCrear] = useState(false); // Nuevo modal de creación
  const [filtroActivo, setFiltroActivo] = useState("todos");
  const [nuevaReserva, setNuevaReserva] = useState({
    cliente: "",
    barbero: "",
    servicio: "",
    fecha: "",
    hora: "",
    telefono: "",
    correo: "",
    estado: "Pendiente",
  });

  const cambiarEstado = (id, nuevoEstado) => {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: nuevoEstado } : r
      )
    );
  };

  const obtenerReservasFiltradas = () => {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // domingo
  const finSemana = new Date(hoy);
  finSemana.setDate(hoy.getDate() + (6 - hoy.getDay())); // sábado

  return reservas.filter((reserva) => {
    const fechaReserva = new Date(reserva.fecha);

    switch (filtroActivo) {
      case "hoy":
        return fechaReserva.toDateString() === hoy.toDateString();

      case "semana":
        return fechaReserva >= inicioSemana && fechaReserva <= finSemana;

      case "pendientes":
        return reserva.estado === "Pendiente";

      case "confirmadas":
        return reserva.estado === "Confirmada";

      default:
        return true; // todos
    }
  }).filter((r) =>
    r.cliente.toLowerCase().includes(filtro.toLowerCase())
  );
};


  // Manejo de formulario nueva reserva
  const handleChange = (e) => {
    setNuevaReserva({ ...nuevaReserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReservas([
      ...reservas,
      { ...nuevaReserva, id: reservas.length + 1 }, // id incremental
    ]);
    setNuevaReserva({
      cliente: "",
      barbero: "",
      servicio: "",
      fecha: "",
      hora: "",
      telefono: "",
      correo: "",
      estado: "Pendiente",
    });
    setModalCrear(false);
  };

  return (
    <div className="admin-reservas">
      <h2>Gestión de Reservas</h2>

      {/* Botón crear reserva */}
      <button className="crear-btn" onClick={() => setModalCrear(true)}>
        ➕ Crear Reserva
      </button>

      {/* 🔍 Filtros y búsqueda */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="botones-filtros">
            <button onClick={() => setFiltroActivo("hoy")}>Hoy</button>
            <button onClick={() => setFiltroActivo("semana")}>Semana actual</button>
            <button onClick={() => setFiltroActivo("pendientes")}>Pendientes</button>
            <button onClick={() => setFiltroActivo("confirmadas")}>Confirmadas</button>
            <button onClick={() => setFiltroActivo("todos")}>Ver todos</button>
        </div>

      </div>

      {/* 📋 Tabla de reservas */}
      <table className="tabla-reservas">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Barbero</th>
            <th>Servicio</th>
            <th>Fecha y Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {obtenerReservasFiltradas().map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.cliente}</td>
                <td>{reserva.barbero}</td>
                <td>{reserva.servicio}</td>
                <td>{reserva.fecha} - {reserva.hora}</td>
                <td>
                  <span className={`estado ${reserva.estado.toLowerCase()}`}>
                    {reserva.estado}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      cambiarEstado(
                        reserva.id,
                        reserva.estado === "Pendiente"
                          ? "Confirmada"
                          : "Pendiente"
                      )
                    }
                  >
                    Cambiar estado
                  </button>
                  <button onClick={() => setModalDetalle(reserva)}>
                    Ver detalle
                  </button>
                  <button className="cancelar" onClick={() => {
                    if (window.confirm("¿Seguro que deseas cancelar esta reserva?")) {
                        cambiarEstado(reserva.id, "Cancelada");
                        }
                            }}>  Cancelar </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 📌 Modal detalle de reserva */}
      {modalDetalle && (
        <div className="reservas-modal">
          <div className="reservas-modal-contenido">
            <h3>Detalle de Reserva</h3>
            <p><b>Cliente:</b> {modalDetalle.cliente}</p>
            <p><b>Correo:</b> {modalDetalle.correo}</p>
            <p><b>Teléfono:</b> {modalDetalle.telefono}</p>
            <p><b>Barbero:</b> {modalDetalle.barbero}</p>
            <p><b>Servicio:</b> {modalDetalle.servicio}</p>
            <p><b>Fecha:</b> {modalDetalle.fecha} - {modalDetalle.hora}</p>
            <p><b>Estado:</b> {modalDetalle.estado}</p>
            <div className="reservas-acciones-modal">
              <button onClick={() => cambiarEstado(modalDetalle.id, "Confirmada")}>Confirmar</button>
              <button onClick={() => cambiarEstado(modalDetalle.id, "Cancelada")}>Cancelar</button>
              <button onClick={() => setModalDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* 📌 Modal crear reserva */}
      {modalCrear && (
        <div className="reservas-modal">
          <div className="reservas-modal-contenido">
            <h3>Nueva Reserva</h3>
            <form onSubmit={handleSubmit} className="reservas-form-crear">
              <input
                type="text"
                name="cliente"
                placeholder="Cliente"
                value={nuevaReserva.cliente}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="correo"
                placeholder="Correo"
                value={nuevaReserva.correo}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={nuevaReserva.telefono}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="barbero"
                placeholder="Barbero"
                value={nuevaReserva.barbero}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="servicio"
                placeholder="Servicio"
                value={nuevaReserva.servicio}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="fecha"
                value={nuevaReserva.fecha}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                name="hora"
                value={nuevaReserva.hora}
                onChange={handleChange}
                required
              />

              <div className="reservas-acciones-modal">
                <button type="button" onClick={() => setModalCrear(false)}>
                  Cancelar
                </button>
                <button type="submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
