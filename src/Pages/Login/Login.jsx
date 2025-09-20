import React, { useState } from "react";
import styles from "./Login.module.css";
import fondo from "../../assets/Fondo.jpg";
import logo from "../../assets/Logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLogin("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("../php/login.php", {
        method: "POST",
        body: formData,
      });
      const respuesta = await res.json();

      if (respuesta.status === "OK") {
        if (respuesta.rol === 1) {
          navigate("/admin/Inicio");
        } else if (respuesta.rol === 2) {
          navigate("/Empleado/InicioEmpleado");
        } else {
          navigate("/Cliente/InicioCliente");
        }
      } else {
        setErrorLogin(respuesta.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.error(err);
      setErrorLogin("Error al conectar con el servidor.");
    }
  };

  return (
    <div className={styles.contenedor}>
      {/* Lado izquierdo */}
      <div className={styles.ladoIzquierdo}>
        <img src={fondo} alt="Fondo" className={styles.fondo} />
        <img src={logo} alt="Logo JP Systems" className={styles.logo} />

        <div className={styles.textoBienvenida}>
          <h1>Agenda tu cita ahora</h1>
          <p>
            ¿Estás buscando un estilo de cabello que te haga sentir como un rey? 
            Nuestros expertos barberos te ofrecen un servicio de calidad. 
            Agenda tu cita en línea ahora.
          </p>
        </div>
      </div>

      {/* Lado derecho */}
      <div className={styles.formularioLogin}>
        <div className={styles.cajaLogin}>
          <h2>Bienvenid@</h2>
          <p>Ingresa a tu cuenta</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorLogin && <p className={styles.error}>{errorLogin}</p>}

            <div className={styles.opciones}>
              <label>
                <input type="checkbox" /> Recuérdame
              </label>
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button class="submitlogin" type="submit">Ingresar</button>
          </form>

          <p className={styles.registro}>
            ¿Eres nuevo?{" "}
            <a href="/public/Registrousuarios.html">Ingresa aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}
