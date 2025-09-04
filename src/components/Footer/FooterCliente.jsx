import styles from './FooterCliente.module.css';

import logo from '../../assets/Logo.png';
import instagram from '../../assets/instagram.png';
import facebook from '../../assets/facebook.png';
import youtube from '../../assets/youtube.png';
import twitter from '../../assets/twitter.png';

function Footer() {
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
          <h4>Nosotros</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Reservas</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Barberos</a></li>
            <li><a href="#">Mis Citas</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>
        <div>
          <h4>Más</h4>
          <ul>
            <li><a href="#">Promociones</a></li>
            <li><a href="#">Galería</a></li>
            <li><a href="#">Nuestra Historia</a></li>
            <li><a href="#">Reseñas</a></li>
            <li><a href="#">PQRS</a></li>
          </ul>
        </div>
        <div>
          <h4>Recursos</h4>
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Prácticas</a></li>
            <li><a href="#">Soporte</a></li>
            <li><a href="#">Redes sociales</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
