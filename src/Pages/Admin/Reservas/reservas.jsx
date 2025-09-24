import { useState, useEffect } from "react";
import "./reservas.css";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalDetalle, setModalDetalle] = useState(null); // guarda reserva seleccionada
  const [modalCrear, setModalCrear] = useState(false); // Nuevo modal de creación
  const [filtroActivo, setFiltroActivo] = useState("todos");

  // ✅ Estado para nueva reserva
  const [nuevaReserva, setNuevaReserva] = useState({
  cliente_id: "",
  empleado_id: "",
  servicio_id: "",
  fecha: "",
  hora: "",
});


  // 🔹 Traer reservas al cargar la página
  useEffect(() => {
    fetch("http://localhost/barberia_app/php/reservas.php")
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error("Error cargando reservas:", err));
  }, []);

  const cambiarEstado = async (id_reserva, nuevoEstado) => {
  try {
    const res = await fetch("http://localhost/barberia_app/php/reservas.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_reserva, estado: nuevoEstado }),
    });

    const data = await res.json();
    if (data.status === "OK") {
      setReservas((prev) =>
        prev.map((r) =>
          r.id_reserva === id_reserva ? { ...r, estado: nuevoEstado } : r
        )
      );
    } else {
      alert("❌ Error: " + data.message);
    }
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
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
        return reserva.estado === "pendiente";

      case "confirmadas":
        return reserva.estado === "confirmada";

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

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost/barberia_app/php/reservas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaReserva),
    });

    const data = await res.json();
    if (data.status === "OK") {
      alert("✅ Reserva creada");
      setModalCrear(false);

      // 🔄 Recargar lista desde el backend
      const res2 = await fetch("http://localhost/barberia_app/php/reservas.php");
      setReservas(await res2.json());
    } else {
      alert("❌ Error: " + data.message);
    }
  } catch (error) {
    console.error("Error al crear:", error);
  }
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
              <tr key={reserva.id_reserva}>
                <td>{reserva.id_reserva}</td>
                <td>{reserva.cliente}</td>
                <td>{reserva.empleado}</td>
                <td>{reserva.servicio}</td>
                <td>{reserva.fecha} - {reserva.hora}</td>
                <td>
  <span className={`estado ${reserva.estado}`}>
    {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
  </span>
</td>

                <td>
                  <button
                    onClick={() =>
                      cambiarEstado(
                        reserva.id_reserva,
                        reserva.estado === "pendiente"
                          ? "confirmada"
                          : "pendiente"
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
                        cambiarEstado(reserva.id_reserva, "cancelada");
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
            <p><b>Barbero:</b> {modalDetalle.empleado}</p>
            <p><b>Servicio:</b> {modalDetalle.servicio}</p>
            <p><b>Fecha:</b> {modalDetalle.fecha} - {modalDetalle.hora}</p>
            <p><b>Estado:</b> {modalDetalle.estado}</p>
            <div className="reservas-acciones-modal">
              <button onClick={() => cambiarEstado(modalDetalle.id_reserva, "confirmada")}>Confirmar</button>
              <button onClick={() => cambiarEstado(modalDetalle.id_reserva, "cancelada")}>Cancelar</button>
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
  type="number"
  name="cliente_id"
  placeholder="ID Cliente"
  value={nuevaReserva.cliente_id}
  onChange={handleChange}
  required
/>

<input
  type="number"
  name="empleado_id"
  placeholder="ID Empleado"
  value={nuevaReserva.empleado_id}
  onChange={handleChange}
  required
/>

<input
  type="number"
  name="servicio_id"
  placeholder="ID Servicio"
  value={nuevaReserva.servicio_id}
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
