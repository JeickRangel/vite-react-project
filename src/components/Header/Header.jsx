import { Link } from "react-router-dom";
import styles from './Header.module.css';
import logo from '../../assets/Logo.png';


function Header({ title }) {
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
        <Link to="/admin/usuarios">Usuarios</Link>
        <Link to="/admin/reportes">Reportes</Link>
        <Link to="/admin/configuracion">Configuración</Link>
        <Link to="/admin/pqrs">PQRS</Link>
      </nav>

      <button className={styles.logout}>Salir</button>
    </header>
  );
}

export default Header;
