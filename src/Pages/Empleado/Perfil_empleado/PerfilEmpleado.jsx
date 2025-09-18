import React, { useState } from "react";
import styles from "./PerfilEmpleado.module.css";

export default function PerfilEmpleado() {
  const [empleado, setEmpleado] = useState({
    nombre: "Juan Pérez",
    correo: "juan.perez@empresa.com",
    documento: "CC 123456789",
    rol: "Barbero",
    telefono: "3124567890",
    direccion: "Calle 123 #45-67",
    foto: "https://via.placeholder.com/300", // puede fallar sin problema
  });

  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState(empleado);

  // Avatar de respaldo (SVG embebido)
  const FALLBACK_AVATAR =
    "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>\
<rect width='100%' height='100%' rx='80' fill='%231976d2'/>\
<text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='64' fill='white'>👤</text>\
</svg>";

  const onImgError = (e) => {
    if (e.currentTarget.src !== FALLBACK_AVATAR) {
      e.currentTarget.src = FALLBACK_AVATAR;
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, foto: reader.result });
    reader.readAsDataURL(file);
  };

  const handleGuardar = () => {
    setEmpleado(formData);
    setEditando(false);
  };

  return (
    <div className={styles.peContainer}>
      {/* TÍTULO: icono + texto (alineado con flex) */}
      <div className={styles.peTitleRow}>
        <span className={styles.peTitleIcon} aria-hidden="true">👤</span>
        <h2 className={styles.peTitleText}>Perfil del Empleado</h2>
      </div>

      {!editando ? (
        <section className={styles.peCard}>
          <div className={styles.peLayout}>
            <img
              src={empleado.foto}
              alt="Foto de perfil"
              className={styles.peAvatar}
              onError={onImgError}
            />

            <div className={styles.peInfo}>
              <p><span className={styles.peKey}>Nombre:</span> {empleado.nombre}</p>
              <p><span className={styles.peKey}>Correo:</span> {empleado.correo}</p>
              <p><span className={styles.peKey}>Documento:</span> {empleado.documento}</p>
              <p><span className={styles.peKey}>Rol:</span> {empleado.rol}</p>
              <p><span className={styles.peKey}>Teléfono:</span> {empleado.telefono}</p>
              <p><span className={styles.peKey}>Dirección:</span> {empleado.direccion}</p>

              <button
                type="button"
                className={styles.peBtnPrimary}
                onClick={() => setEditando(true)}
              >
                ✏️ Editar Perfil
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.peCard}>
          <h3 className={styles.peSubtitle}>Editar información</h3>

          <div className={styles.peFotoBox}>
            <img
              src={formData.foto}
              alt="Foto de perfil"
              className={styles.peAvatar}
              onError={onImgError}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className={styles.peInputFile}
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Nombre</label>
            <input
              className={styles.peInput}
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Correo</label>
            <input
              className={styles.peInput}
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Teléfono</label>
            <input
              className={styles.peInput}
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Dirección</label>
            <input
              className={styles.peInput}
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className={styles.peActions}>
            <button type="button" className={styles.peBtnSuccess} onClick={handleGuardar}>
              💾 Guardar
            </button>
            <button
              type="button"
              className={styles.peBtnDanger}
              onClick={() => setEditando(false)}
            >
              ❌ Cancelar
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
