import React, { useState, useEffect } from "react";
import "./AdminServicios.css";

const AdminServicios = () => {
  // Lista de servicios simulada
  const [servicios, setServicios] = useState([]);

  const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0, // evita decimales innecesarios
});


  // Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);

   // Estado modal eliminar
  const [modalEliminar, setModalEliminar] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id_servicio: null,
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  });

  // 🔹 1. Cargar servicios desde PHP
  useEffect(() => {
    fetch("http://localhost/barberia_app/php/servicios.php")
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error(err));
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setFormData({ id_servicio: null, nombre: "", descripcion: "", precio: "", duracion: "" });
    setModalAbierto(true);
  };

  const confirmarEliminar = (servicio) => {
  setServicioAEliminar(servicio);
  setModalEliminar(true);
};


  // Abrir modal para editar
  const abrirModalEditar = (servicio) => {
    setFormData(servicio);
    setModalAbierto(true);
  };

  // 🔹 2. Guardar en la base de datos
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = formData.id_servicio ? "PUT" : "POST";

    fetch("http://localhost/barberia_app/php/servicios.php", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(() => {
        // Refrescar lista después de guardar
        return fetch("http://localhost/barberia_app/php/servicios.php")
          .then(res => res.json())
          .then(data => setServicios(data));
      });
    setModalAbierto(false);
  };

  // 🔹 3. Eliminar servicio
  const eliminarServicio = () => {
    fetch("http://localhost/barberia_app/php/servicios.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id_servicio=${servicioAEliminar.id_servicio}`,
    })
      .then(res => res.json())
      .then(() => {
        setServicios(servicios.filter(s => s.id_servicio !== servicioAEliminar.id_servicio));
      });
    setModalEliminar(false);
    setServicioAEliminar(null);
  };

  return (
    <div className="admin-servicios">
      <h2>Gestión de Servicios</h2>

      {/* Botón para abrir modal */}
      <button className="btn-crear" onClick={abrirModalCrear}>
        + Crear Servicio
      </button>

      {/* Listado de servicios */}
      <table className="tabla-servicios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s) => (
            <tr key={s.id_servicio}>
              <td>{s.nombre}</td>
              <td>{s.descripcion}</td>
              <td>{formatoCOP.format(s.precio)}</td>
              <td>{s.duracion} min</td>
              <td>
                <button className="btn-editar" onClick={() => abrirModalEditar(s)}>Editar</button>
                <button className="btn-eliminar" onClick={() => confirmarEliminar(s)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Crear/editar*/}
      {modalAbierto && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{formData.id_servicio ? "Editar Servicio" : "Crear Servicio"}</h3>
            <form className="admin-servicio-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Nombre del Servicio</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Duración (minutos)</label>
                <input
                  type="number"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-modal-buttons">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button type="button" className="btn-cerrar" onClick={() => setModalAbierto(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {modalEliminar && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar <b>{servicioAEliminar?.nombre}</b>?</p>
            <div className="admin-modal-buttons">
              <button className="admin-btn-eliminar" onClick={eliminarServicio}>Sí, eliminar</button>
              <button className="admin-btn-cerrar" onClick={() => setModalEliminar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServicios;
