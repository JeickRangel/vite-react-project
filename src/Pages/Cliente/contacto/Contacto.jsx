import React from "react";
import "./Contacto.css";

// Importar imágenes locales desde assets
import instagram from "../../../assets/instagram.png";
import facebook from "../../../assets/facebook.png";
import xIcon from "../../../assets/x.png";
import youtube from "../../../assets/youtube.png";

const Contacto = () => {
  return (
    <main className="contacto-contenedor">
      <h1>Contáctanos</h1>
      <p className="intro">
        ¿Tienes dudas o quieres sugerir algo? Escríbenos y te responderemos
        pronto.
      </p>

      <div className="contacto-grid">
        {/* Formulario */}
        <div className="contacto-form">
          <form>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              required
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="correo@ejemplo.com"
              required
            />

            <label htmlFor="asunto">Asunto</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              placeholder="Motivo de tu mensaje"
              required
            />

            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="6"
              placeholder="Escribe tu mensaje aquí..."
              required
            ></textarea>

            <button type="submit">Enviar mensaje</button>
          </form>
        </div>

        {/* Información */}
        <div className="contacto-info">
          <h2>Información</h2>
          <p>
            <strong>Teléfono:</strong> 310 560 6363
          </p>
          <p>
            <strong>Email:</strong> contacto@jpsystems.com
          </p>
          <p>
            <strong>Dirección:</strong> Calle 2 A 28-52, Bogotá D.C.
          </p>

          <h2>Síguenos</h2>
          <div className="iconos">
            <a href="#">
              <img src={instagram} alt="Instagram" />
            </a>
            <a href="#">
              <img src={facebook} alt="Facebook" />
            </a>
            <a href="#">
              <img src={xIcon} alt="X" />
            </a>
            <a href="#">
              <img src={youtube} alt="YouTube" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contacto;
