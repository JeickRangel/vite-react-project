import styles from './FooterEmpleado.module.css';

import logo from '../../assets/Logo.png';
import instagram from '../../assets/instagram.png';
import facebook from '../../assets/facebook.png';
import youtube from '../../assets/youtube.png';
import twitter from '../../assets/twitter.png';

function FooterEmpleado() {
  return (
    <footer className={styles.footer}>
      {/* Sección Social */}
      <div className={styles.social}>
        <img src={logo} alt="JP Systems" className={styles.logoFooter} />
        <p>Síguenos:</p>
        <div className={styles.iconos}>
          <a href="#"><img src={instagram} alt="Instagram" /></a>
          <a href="#"><img src={facebook} alt="Facebook" /></a>
          <a href="#"><img src={twitter} alt="Twitter" /></a>
          <a href="#"><img src={youtube} alt="YouTube" /></a>
        </div>
      </div>

      {/* Sección Links */}
      <div className={styles.links}>
        <div>
          <h4>Panel Empleado</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Mis Citas</a></li>
            <li><a href="#">Clientes</a></li>
            <li><a href="#">Reportes</a></li>
            <li><a href="#">Perfil</a></li>
          </ul>
        </div>
        <div>
          <h4>Recursos</h4>
          <ul>
            <li><a href="#">Capacitaciones</a></li>
            <li><a href="#">Manual de uso</a></li>
            <li><a href="#">Soporte</a></li>
            <li><a href="#">Normativas</a></li>
          </ul>
        </div>
        <div>
          <h4>Comunidad</h4>
          <ul>
            <li><a href="#">Eventos</a></li>
            <li><a href="#">Promociones</a></li>
            <li><a href="#">Noticias</a></li>
            <li><a href="#">Redes internas</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default FooterEmpleado;
