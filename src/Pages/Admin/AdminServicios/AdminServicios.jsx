import React, { useState } from "react";
import "./AdminServicios.css";

const AdminServicios = () => {
  // Lista de servicios simulada
  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Corte de Cabello", descripcion: "Corte clásico", precio: 25000, duracion: 30 },
    { id: 2, nombre: "Afeitado", descripcion: "Afeitado con navaja", precio: 15000, duracion: 20 },
  ]);

  // Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);

   // Estado modal eliminar
  const [modalEliminar, setModalEliminar] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  });

  // Manejo de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setFormData({ id: null, nombre: "", descripcion: "", precio: "", duracion: "" });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (servicio) => {
    setFormData(servicio);
    setModalAbierto(true);
  };

  // Guardar servicio (crear o editar en memoria)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Editar
      setServicios(servicios.map(s => (s.id === formData.id ? formData : s)));
    } else {
      // Crear
      const nuevo = { ...formData, id: Date.now() };
      setServicios([...servicios, nuevo]);
    }
    setModalAbierto(false);
  };

  // Abrir modal de confirmación
  const confirmarEliminar = (servicio) => {
    setServicioAEliminar(servicio);
    setModalEliminar(true);
  };

  // Ejecutar la eliminación
  const eliminarServicio = () => {
    setServicios(servicios.filter((s) => s.id !== servicioAEliminar.id));
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
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.descripcion}</td>
              <td>${s.precio}</td>
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
        <div className="modal-overlay">
          <div className="modal">
            <h3>{formData.id ? "Editar Servicio" : "Crear Servicio"}</h3>
            <form className="servicio-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Servicio</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duración (minutos)</label>
                <input
                  type="number"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button type="button" className="btn-cerrar" onClick={() => setModalAbierto(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {modalEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar <b>{servicioAEliminar?.nombre}</b>?</p>
            <div className="modal-buttons">
              <button className="btn-eliminar" onClick={eliminarServicio}>Sí, eliminar</button>
              <button className="btn-cerrar" onClick={() => setModalEliminar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServicios;
