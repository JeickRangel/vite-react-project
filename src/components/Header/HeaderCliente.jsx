import { Link, useNavigate } from "react-router-dom"; // 👈 faltaba useNavigate
import { clearUser, getUser } from "../../utils/auth";
import styles from "./HeaderCliente.module.css";
import logo from "../../assets/Logo.png";

function HeaderCliente({ title }) {
  const navigate = useNavigate();
  const usuario = getUser();

  const logout = () => {
    clearUser(); // ❌ borra la sesión
    navigate("/", { replace: true }); // 🔄 redirige al login
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="JP Systems" />
        <span>{title}</span>
      </div>

      <nav className={styles.nav}>
        <Link to="/Cliente/inicio">Inicio</Link>
        <Link to="/Cliente/reservar">Reservar</Link>
        <Link to="/Cliente/servicios">Servicios</Link>
        <Link to="/Cliente/BarberosCliente">Barberos</Link>
        <Link to="/Cliente/MisCitas">Mis Citas</Link>
        <Link to="/Cliente/contacto">Contáctenos</Link>
        <Link to="/Cliente/pqrs">PQRS</Link>
      </nav>

      <div className={styles.userSection}>
        {usuario && <span className={styles.userName}>Hola, {usuario.nombre}</span>}
        <button onClick={logout} className={styles.logout}>
          Salir
        </button>
      </div>
    </header>
  );
}

export default HeaderCliente;
