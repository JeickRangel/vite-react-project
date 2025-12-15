import { useState, useEffect } from "react";
import styles from "./reservas.module.css";
import { API_BASE } from "/src/config/api";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("todos");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  const [nuevaReserva, setNuevaReserva] = useState({
    cliente_id: "",
    empleado_id: "",
    servicio_id: "",
    fecha: "",
    hora: "",
  });

  /* ✅ Cargar reservas */
  useEffect(() => {
    fetch(`${API_BASE}/reservas.php`)
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error("Error cargando reservas:", err));
  }, []);

  /* ✅ Cargar clientes, empleados y servicios */
  useEffect(() => {
    fetch(`${API_BASE}/usuarios.php?rol=3`)
      .then((res) => res.json())
      .then(setClientes)
      .catch((err) => console.error("Error cargando clientes:", err));

    fetch(`${API_BASE}/usuarios.php?rol=2`)
      .then((res) => res.json())
      .then(setEmpleados)
      .catch((err) => console.error("Error cargando empleados:", err));

    fetch(`${API_BASE}/servicios.php`)
      .then((res) => res.json())
      .then(setServicios)
      .catch((err) => console.error("Error cargando servicios:", err));
  }, []);

  /* ✅ Cargar horarios disponibles */
  useEffect(() => {
    if (nuevaReserva.empleado_id && nuevaReserva.fecha && nuevaReserva.servicio_id) {
      fetch(
        `${API_BASE}/horarios_disponibles.php?empleado_id=${nuevaReserva.empleado_id}&fecha=${nuevaReserva.fecha}&servicio_id=${nuevaReserva.servicio_id}`
      )
        .then((res) => res.json())
        .then(setHorariosDisponibles)
        .catch((err) => console.error("Error cargando horarios:", err));
    } else {
      setHorariosDisponibles([]);
    }
  }, [nuevaReserva.empleado_id, nuevaReserva.fecha, nuevaReserva.servicio_id]);

  const handleChange = (e) => {
    setNuevaReserva({ ...nuevaReserva, [e.target.name]: e.target.value });
  };

  const recargarReservas = async () => {
    const res = await fetch(`${API_BASE}/reservas.php`);
    setReservas(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/reservas.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaReserva),
      });

      const data = await res.json();
      if (data.status === "OK") {
        alert("✅ Reserva creada");
        setModalCrear(false);
        await recargarReservas();
      } else {
        alert("❌ " + (data.message || "No se pudo crear la reserva"));
      }
    } catch (error) {
      console.error("Error al crear:", error);
      alert("❌ Error de conexión al crear la reserva");
    }
  };

  const cambiarEstado = async (id_reserva, nuevoEstado) => {
    try {
      const res = await fetch(`${API_BASE}/reservas.php`, {
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
        alert("❌ Error: " + (data.message || "No se pudo actualizar"));
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("❌ Error de conexión al actualizar");
    }
  };

  const obtenerReservasFiltradas = () => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + (6 - hoy.getDay()));

    return reservas
      .filter((reserva) => {
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
            return true;
        }
      })
      .filter((r) =>
        (r.cliente || "").toLowerCase().includes(filtro.toLowerCase())
      );
  };

  const capitalizar = (txt) => txt.charAt(0).toUpperCase() + txt.slice(1);

  return (
    <div className={styles.adminReservas}>
      <h2>Gestión de Reservas</h2>

      <button className={styles.crearBtn} onClick={() => setModalCrear(true)}>
        ➕ Crear Reserva
      </button>

      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className={styles.botonesFiltros}>
          <button onClick={() => setFiltroActivo("hoy")}>Hoy</button>
          <button onClick={() => setFiltroActivo("semana")}>Semana actual</button>
          <button onClick={() => setFiltroActivo("pendientes")}>Pendientes</button>
          <button onClick={() => setFiltroActivo("confirmadas")}>Confirmadas</button>
          <button onClick={() => setFiltroActivo("todos")}>Ver todos</button>
        </div>
      </div>

      <table className={styles.tablaReservas}>
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
                <span
                  className={`${styles.estado} ${styles["estado" + capitalizar(reserva.estado)]}`}
                >
                  {capitalizar(reserva.estado)}
                </span>
              </td>
              <td>
                <button
                  className={`${styles.accionesBtn} ${styles.btnCambiar}`}
                  onClick={() =>
                    cambiarEstado(
                      reserva.id_reserva,
                      reserva.estado === "pendiente" ? "confirmada" : "pendiente"
                    )
                  }
                >
                  Cambiar estado
                </button>

                <button
                  className={`${styles.accionesBtn} ${styles.btnDetalle}`}
                  onClick={() => setModalDetalle(reserva)}
                >
                  Ver detalle
                </button>

                <button
                  className={`${styles.accionesBtn} ${styles.btnCancelar}`}
                  onClick={() => {
                    if (window.confirm("¿Seguro que deseas cancelar esta reserva?")) {
                      cambiarEstado(reserva.id_reserva, "cancelada");
                    }
                  }}
                >
                  Cancelar
                </button>

                <button
                  className={`${styles.accionesBtn} ${styles.btnCompletar}`}
                  onClick={() => cambiarEstado(reserva.id_reserva, "completada")}
                >
                  Completar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalDetalle && (
        <div className={styles.reservasModal}>
          <div className={styles.modalContenido}>
            <h3>Detalle de Reserva</h3>
            <p><b>Cliente:</b> {modalDetalle.cliente}</p>
            <p><b>Correo:</b> {modalDetalle.correo}</p>
            <p><b>Teléfono:</b> {modalDetalle.telefono}</p>
            <p><b>Barbero:</b> {modalDetalle.empleado}</p>
            <p><b>Servicio:</b> {modalDetalle.servicio}</p>
            <p><b>Fecha:</b> {modalDetalle.fecha} - {modalDetalle.hora}</p>
            <p><b>Estado:</b> {modalDetalle.estado}</p>
            <div className={styles.modalAcciones}>
              <button onClick={() => cambiarEstado(modalDetalle.id_reserva, "confirmada")}>
                Confirmar
              </button>
              <button onClick={() => cambiarEstado(modalDetalle.id_reserva, "cancelada")}>
                Cancelar
              </button>
              <button onClick={() => cambiarEstado(modalDetalle.id_reserva, "completada")}>
                Completar
              </button>
              <button onClick={() => setModalDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {modalCrear && (
        <div className={styles.reservasModal}>
          <div className={styles.modalContenido}>
            <h3>Nueva Reserva</h3>
            <form onSubmit={handleSubmit} className={styles.formCrear}>
              <select
                name="cliente_id"
                value={nuevaReserva.cliente_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              <select
                name="empleado_id"
                value={nuevaReserva.empleado_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione barbero</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>

              <select
                name="servicio_id"
                value={nuevaReserva.servicio_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione servicio</option>
                {servicios.map((s) => (
                  <option key={s.id_servicio} value={s.id_servicio}>
                    {s.nombre} - ${s.precio}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="fecha"
                value={nuevaReserva.fecha}
                onChange={handleChange}
                required
              />

              <select
                name="hora"
                value={nuevaReserva.hora}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione hora disponible</option>
                {horariosDisponibles.map((h, i) => (
                  <option key={i} value={h}>{h}</option>
                ))}
              </select>

              <div className={styles.modalAcciones}>
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
