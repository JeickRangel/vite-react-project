import React, { useState, useEffect } from "react";
import styles from "./AdminDisponibilidad.module.css";
import { API_BASE } from "/src/config/api";

export default function AdminDisponibilidad() {
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [formData, setFormData] = useState({
    dias: [],       // ahora es un array de días
    hora_inicio: "",
    hora_fin: "",
  });
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    //fetch("http://localhost/barberia_app/php/usuarios.php?rol=2") // 2 = Empleado
    fetch(`${API_BASE}/usuarios.php?rol=2`) // 2 = Empleado
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error(err));
  }, []);

  const cargarDisponibilidad = (id) => {
    setIdEmpleado(id);
    //fetch(`http://localhost/barberia_app/php/disponibilidad.php?id_usuario=${id}`)
    fetch(`${API_BASE}/disponibilidad.php?id_usuario=${id}`)
      .then(res => res.json())
      .then(data => setDisponibilidad(data))
      .catch(err => console.error(err));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, dias: [...formData.dias, value] });
    } else {
      setFormData({ ...formData, dias: formData.dias.filter(d => d !== value) });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //fetch("http://localhost/barberia_app/php/disponibilidad.php", {
    fetch(`${API_BASE}/disponibilidad.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, id_usuario: idEmpleado }),
    })
      .then(res => res.json())
      .then(() => cargarDisponibilidad(idEmpleado));

    setModalAbierto(false);
    setFormData({ dias: [], hora_inicio: "", hora_fin: "" });
  };

  const eliminarDisponibilidad = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este horario?")) {
      //fetch("http://localhost/barberia_app/php/disponibilidad.php", {
      
      fetch(`${API_BASE}/disponibilidad.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_disponibilidad: id }),
      })
        .then(res => res.json())
        .then(() => cargarDisponibilidad(idEmpleado))
        .catch(err => console.error(err));
    }
  };

  const diasSemana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Disponibilidad de Empleados</h2>

      <select
        className={styles.select}
        onChange={(e) => cargarDisponibilidad(e.target.value)}
      >
        <option value="">Seleccione un empleado</option>
        {empleados.map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.nombre}
          </option>
        ))}
      </select>

      {idEmpleado && (
        <>
          <button
            className={styles.btnAgregar}
            onClick={() => setModalAbierto(true)}
          >
            + Agregar Disponibilidad
          </button>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {disponibilidad.map((d) => (
                <tr key={d.id_disponibilidad}>
                  <td>{d.dia_semana}</td>
                  <td>{d.hora_inicio}</td>
                  <td>{d.hora_fin}</td>
                  <td>
                    <button
                      className={styles.btnEliminar}
                      onClick={() => eliminarDisponibilidad(d.id_disponibilidad)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {modalAbierto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Agregar Disponibilidad</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              
              <label className={styles.label}>Seleccione días</label>
              <div className={styles.checkboxGroup}>
                {diasSemana.map(dia => (
                  <label key={dia}>
                    <input
                      type="checkbox"
                      value={dia}
                      checked={formData.dias.includes(dia)}
                      onChange={handleDayChange}
                    />
                    {dia}
                  </label>
                ))}
              </div>

              <label className={styles.label}>Hora Inicio</label>
              <input
                className={styles.input}
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
              />

              <label className={styles.label}>Hora Fin</label>
              <input
                className={styles.input}
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                required
              />

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.btnGuardar}>
                  Guardar
                </button>
                <button
                  type="button"
                  className={styles.btnCerrar}
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
