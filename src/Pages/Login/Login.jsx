import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import fondo from "../../assets/Fondo.jpg";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { setUser, getUser } from "../../utils/auth"; // ✅ importamos helpers
import { API_BASE } from "/src/config/api";


// Componente Login para Netifly
const DEMO_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? "";
const DEMO_PASS  = import.meta.env.VITE_ADMIN_PASS  ?? "";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  // ✅ Si ya está logueado, lo mando directo a su vista
  useEffect(() => {
    const usuario = getUser();
    if (usuario) {
      if (usuario.rol === 1) {
        navigate("/admin/Inicio", { replace: true });
      } else if (usuario.rol === 2) {
        navigate("/Empleado/InicioEmpleado", { replace: true });
      } else {
        navigate("/Cliente/inicio", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLogin("");

    //para Netifly demo
    // ✅ MODO DEMO: si coincide con las variables de Netlify, entrar sin backend
  if (email === DEMO_EMAIL && password === DEMO_PASS) {
    setUser({
      id: 0,
      nombre: "Admin Demo",
      correo: DEMO_EMAIL,
      rol: 1, // 1 = Admin (según tu lógica actual)
    });
    navigate("/admin/Inicio", { replace: true });
    return; // 🚪 no seguimos al fetch
  }

  if (email === "empleado@demo.com" && password === "Empleado123!") {
  setUser({
    id: 0,
    nombre: "Empleado Demo",
    correo: email,
    rol: 2, // 2 = Empleado
  });
  navigate("/Empleado/InicioEmpleado", { replace: true });
  return;
}

if (email === "cliente@demo.com" && password === "Cliente123!") {
  setUser({
    id: 0,
    nombre: "Cliente Demo",
    correo: email,
    rol: 3, // 3 = Cliente
  });
  navigate("/Cliente/inicio", { replace: true });
  return;
}

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      //const res = await fetch("http://localhost/barberia_app/php/login.php", {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        body: formData,
      });
      const respuesta = await res.json();

      if (respuesta.status === "OK") {
        // ✅ Guardar usuario en localStorage
        setUser({
          id: respuesta.usuario.id,
          nombre: respuesta.usuario.nombre,
          correo: respuesta.usuario.correo,
          rol: respuesta.usuario.rol,
        });

        // ✅ Redirigir según rol
        if (respuesta.usuario.rol === 1) {
          navigate("/admin/Inicio", { replace: true });
        } else if (respuesta.usuario.rol === 2) {
          navigate("/Empleado/InicioEmpleado", { replace: true });
        } else {
          navigate("/Cliente/inicio", { replace: true });
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

            <button type="submit">Ingresar</button>
          </form>

          <p className={styles.registro}>
            ¿Eres nuevo? <Link to="/registro">Ingresa aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
