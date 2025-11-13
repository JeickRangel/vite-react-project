import { useState } from "react";
import styles from "./Registro.module.css";
import fondo from "../../assets/Fondo.jpg";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    genero: "",
    tipo_doc: "",
    numero_doc: "",
  });

  const irALogin = () => {
  setModalExito(false);
  navigate("/");   // como tu login está en la raíz
};


  const [modalExito, setModalExito] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const datos = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        datos.append(key, value)
      );

      //const res = await fetch("http://localhost/barberia_app/php/guardar.php", {
      const res = await fetch(`${API_BASE}/guardar.php`, {
        method: "POST",
        body: datos,
      });

      const texto = await res.text();
      console.log("Respuesta del servidor:", texto);

      if (texto.includes("¡OK!")) {
        setModalExito(true);
      } else {
        alert(texto);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al enviar el formulario.");
    }
  };

  return (
    <div className={styles.contenedor}>
      {/* Lado izquierdo */}
      <div className={styles.ladoIzquierdo}>
        <img src={fondo} alt="Fondo" className={styles.fondo} />
        <img src={logo} alt="Logo JP Systems" className={styles.logo} />
        <div className={styles.textoBienvenida}>
          <h1>Regístrate</h1>
          <p>
            Ingresa tus datos y comienza a agendar tus citas de forma rápida y
            sencilla.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className={styles.formularioLogin}>
        <div className={styles.cajaLogin}>
          <h2>Crear cuenta</h2>

          <form onSubmit={handleSubmit}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña segura"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="confirmar"
              placeholder="Vuelve a escribir tu contraseña"
              value={formData.confirmar}
              onChange={handleChange}
              required
            />

            <label>Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>

            <label>Tipo de documento</label>
            <select
              name="tipo_doc"
              value={formData.tipo_doc}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="CE">Cédula de extranjería</option>
            </select>

            <label>Número de documento</label>
            <input
              type="text"
              name="numero_doc"
              placeholder="Ej: 1234567890"
              value={formData.numero_doc}
              onChange={handleChange}
              required
            />

            <button type="submit">Registrarme</button>
          </form>

          <p className={styles.registro}>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </div>

      {/* Modal de éxito */}
      {modalExito && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <h2>¡Registro exitoso!</h2>
            <p>
              Tu cuenta ha sido creada correctamente. Puedes iniciar sesión
              ahora.
            </p>
            <button onClick={irALogin}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}
