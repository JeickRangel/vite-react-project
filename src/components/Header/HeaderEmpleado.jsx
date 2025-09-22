import { Link, useNavigate  } from "react-router-dom";
import { clearUser, getUser } from "../../utils/auth";
import styles from './HeaderEmpleado.module.css';
import logo from '../../assets/Logo.png';

function HeaderEmpleado({ title }) {
  const navigate = useNavigate();
  const usuario = getUser();

  const logout = () => {
    clearUser(); // ❌ borrar la sesión
    navigate("/", { replace: true }); // 🔄 redirigir al login
  };

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
        <Link to="/Empleado/ReportesEmpleado">Reportes</Link>
        <Link to="/Empleado/PerfilEmpleado">Perfil</Link>
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

export default HeaderEmpleado;
