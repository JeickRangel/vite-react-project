import { Link, useNavigate  } from "react-router-dom";
import { clearUser, getUser } from "../../utils/auth";
import styles from './Header.module.css';
import logo from '../../assets/Logo.png';


function Header({ title }) {

  const navigate = useNavigate();
  const usuario = getUser(); // opcional, para mostrar el nombre

  const logout = () => {
    clearUser(); // ❌ borrar usuario del localStorage
    navigate("/", { replace: true }); // 🔄 redirigir al login
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="JP Systems" />
        <span>{title}</span>
      </div>

      <nav className={styles.nav}>
        <Link to="/admin/Inicio">Inicio</Link>
        <Link to="/admin/reservas">Reservas</Link>
        <Link to="/admin/servicios">Servicios</Link> 
        <Link to="/admin/AdminBarberos">Barberos</Link>
        <Link to="/admin/AdminUsuarios">Usuarios</Link>
        <Link to="/admin/reportes">Reportes</Link>
        <Link to="/admin/AdminConfiguracion">Configuración</Link>
        <Link to="/admin/AdminPQRS">PQRS</Link>
      </nav>

      <div className={styles.userSection}>
        {usuario && <span className={styles.userName}>Hola, {usuario.nombre}</span>}
        <button onClick={logout} className={styles.logout}>Salir</button>
      </div>
    </header>
  );
}

export default Header;
