import { Link } from "react-router-dom";
import styles from './HeaderEmpleado.module.css';
import logo from '../../assets/Logo.png';

function HeaderEmpleado({ title }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="JP Systems" />
        <span>{title}</span>
      </div>

      <nav className={styles.nav}>
        <Link to="/Empleado/InicioEmpleado">Inicio</Link>
        <Link to="/Empleado/MisCitasEmpleado">Mis Citas</Link>
        <Link to="/Empleado/ClientesEmpleado">Clientes</Link>
        <Link to="/Empleado/reportes">Reportes</Link>
        <Link to="/Empleado/perfil">Perfil</Link>
      </nav>

      <button className={styles.logout}>Salir</button>
    </header>
  );
}

export default HeaderEmpleado;
