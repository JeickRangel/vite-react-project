import { Link } from "react-router-dom";
import styles from './HeaderCliente.module.css';
import logo from '../../assets/Logo.png';


function Header({ title }) {
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
        <Link to="/Cliente/Barberos">Barberos</Link>
        <Link to="/Cliente/AdminUsuarios">Mis Citas</Link>
        <Link to="/Cliente/reportes">Contáctenos</Link>
        <Link to="/Cliente/AdminPQRS">PQRS</Link>
      </nav>

      <button className={styles.logout}>Salir</button>
    </header>
  );
}

export default Header;
