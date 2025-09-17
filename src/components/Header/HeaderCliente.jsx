import { Link } from "react-router-dom";
import styles from './HeaderCliente.module.css';
import logo from '../../assets/Logo.png';


function HeaderCliente({ title }) {
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

      <button className={styles.logout}>Salir</button>
    </header>
  );
}

export default HeaderCliente;
