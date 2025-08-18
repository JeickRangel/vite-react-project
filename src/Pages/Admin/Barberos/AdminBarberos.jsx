import React, { useState, useEffect } from "react";
import "./AdminBarberos.css";

export default function AdminBarberos() {
  const [barberos, setBarberos] = useState([
    { id: 1, nombre: "Carlos Gómez", especialidad: "Fade", horario: "Martes a Sábado / 11:00am a 8:00pm", telefono: "3001234567", correo: "carlos@barber.com", estado: "Activo", foto: null },
    { id: 2, nombre: "Andrés Pérez", especialidad: "Corte Clásico", horario: "Martes a Sábado / 11:00am a 8:00pm", telefono: "3109876543", correo: "andres@barber.com", estado: "Activo", foto: null }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [nuevoBarbero, setNuevoBarbero] = useState({
    nombre: "", especialidad: "", horario: "", telefono: "", correo: "", estado: "Activo", fotoFile: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // cleanup al desmontar el componente (libera object URLs)
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoBarbero({ ...nuevoBarbero, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // libera preview anterior si existe
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(file);
      setNuevoBarbero({ ...nuevoBarbero, fotoFile: file });
      setPreview(url);
    }
  };

  const agregarBarbero = () => {
    if (!nuevoBarbero.nombre || !nuevoBarbero.especialidad) {
      alert("Completa los campos obligatorios");
      return;
    }
    const nuevo = {
      ...nuevoBarbero,
      id: barberos.length + 1,
      // guardamos la URL de preview como 'foto' para mostrar en la tabla
      foto: preview || null
    };
    setBarberos([...barberos, nuevo]);
    // reset form
    setNuevoBarbero({ nombre: "", especialidad: "", horario: "", telefono: "", correo: "", estado: "Activo", fotoFile: null });
    if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarBarbero();
  };

  const eliminarBarbero = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este barbero?")) {
      setBarberos(barberos.filter(b => b.id !== id));
    }
  };

    const [modo, setModo] = useState("crear"); // "crear" | "editar"
    const [editandoId, setEditandoId] = useState(null);

    const editarBarbero = (barbero) => {
    setNuevoBarbero({ ...barbero, fotoFile: null }); // cargamos datos en el formulario
    setPreview(barbero.foto || null);                // mostramos foto actual si existe
    setEditandoId(barbero.id);
    setModo("editar");
    setShowModal(true);
    };

    const guardarCambios = () => {
  if (!nuevoBarbero.nombre || !nuevoBarbero.especialidad) {
    alert("Completa los campos obligatorios");
    return;
  }

  if (modo === "crear") {
    const nuevo = {
      ...nuevoBarbero,
      id: barberos.length + 1,
      foto: preview || null
    };
    setBarberos([...barberos, nuevo]);
  } else if (modo === "editar") {
    setBarberos(barberos.map(b =>
      b.id === editandoId ? { ...nuevoBarbero, id: editandoId, foto: preview || null } : b
    ));
  }

  // reset form
  setNuevoBarbero({ nombre: "", especialidad: "", horario: "", telefono: "", correo: "", estado: "Activo", fotoFile: null });
  if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
  setEditandoId(null);
  setModo("crear");
  setShowModal(false);
};



  return (
    <div className="admin-barberos">
      <h2 className="admin-barberos__title">Gestión de Barberos</h2>

      <button
        className="admin-barberos__btn admin-barberos__btn--add"
        onClick={() => setShowModal(true)}
      >
        + Agregar Barbero
      </button>

      <table className="admin-barberos__table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Horario</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {barberos.map(barbero => (
            <tr key={barbero.id}>
              <td>
                {barbero.foto ? (
                  <img src={barbero.foto} alt="Foto" className="admin-barberos__photo" />
                ) : (
                  <span className="admin-barberos__photo--empty">Sin foto</span>
                )}
              </td>
              <td>{barbero.nombre}</td>
              <td>{barbero.especialidad}</td>
              <td>{barbero.horario}</td>
              <td>{barbero.telefono}</td>
              <td>{barbero.correo}</td>
              <td>{barbero.estado}</td>
              <td>
                <div className="admin-barberos__actions">
                  <button  className="admin-barberos__btn admin-barberos__btn--edit"  onClick={() => editarBarbero(barbero)}>  Editar</button>
                  <button
                    className="admin-barberos__btn admin-barberos__btn--delete"
                    onClick={() => eliminarBarbero(barbero.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="admin-barberos__overlay" role="dialog" aria-modal="true">
          <div className="admin-barberos__dialog">
            <h3 className="admin-barberos__dialog-title">
                {modo === "crear" ? "Agregar Barbero" : "Editar Barbero"}
                    </h3>


            <form className="admin-barberos__form" onSubmit={handleSubmit}>
              <label className="admin-barberos__label">Nombre</label>
              <input className="admin-barberos__input" type="text" name="nombre" value={nuevoBarbero.nombre} onChange={handleChange} />

              <label className="admin-barberos__label">Especialidad</label>
              <input className="admin-barberos__input" type="text" name="especialidad" value={nuevoBarbero.especialidad} onChange={handleChange} />

              <label className="admin-barberos__label">Horario</label>
              <input className="admin-barberos__input" type="text" name="horario" value={nuevoBarbero.horario} onChange={handleChange} />

              <label className="admin-barberos__label">Teléfono</label>
              <input className="admin-barberos__input" type="text" name="telefono" value={nuevoBarbero.telefono} onChange={handleChange} />

              <label className="admin-barberos__label">Correo</label>
              <input className="admin-barberos__input" type="email" name="correo" value={nuevoBarbero.correo} onChange={handleChange} />

              <label className="admin-barberos__label">Foto</label>
              <input className="admin-barberos__file" type="file" name="foto" accept="image/*" onChange={handleFileChange} />

              {preview && (
                <div className="admin-barberos__preview">
                  <img src={preview} alt="Vista previa" className="admin-barberos__preview-img" />
                </div>
              )}

              <label className="admin-barberos__label">Estado</label>
              <select className="admin-barberos__select" name="estado" value={nuevoBarbero.estado} onChange={handleChange}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>

              {/* boton submit dentro del form (también hay botones fuera para estilo fijo) */}
            </form>

            <div className="admin-barberos__dialog-actions">
  <button
    onClick={guardarCambios}
    className="admin-barberos__btn admin-barberos__btn--confirm"
  >
    {modo === "crear" ? "Guardar" : "Actualizar"}
  </button>
  <button
    onClick={() => {
      if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
      setNuevoBarbero({ nombre: "", especialidad: "", horario: "", telefono: "", correo: "", estado: "Activo", fotoFile: null });
      setEditandoId(null);
      setModo("crear");
      setShowModal(false);
    }}
    className="admin-barberos__btn admin-barberos__btn--cancel"
  >
    Cancelar
  </button>
</div>

          </div>
        </div>
      )}
    </div>
  );
}
