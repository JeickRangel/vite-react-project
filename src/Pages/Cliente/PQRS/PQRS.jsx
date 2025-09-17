import React from "react";
import "./PQRS.css";

const PQRS = () => {
  return (
    <main className="pqrs-contenedor">
      <h1>¿Peticiones, Quejas, Reclamos o Sugerencias?</h1>
      <p className="intro">
        ¿Tienes algún PQRS? Déjanos tu mensaje y pronto te contactaremos.
      </p>

      <div className="pqrs-grid">
        {/* Formulario PQRS */}
        <div className="pqrs-form">
          <form>
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" required>
              <option value="" disabled selected>
                Selecciona una opción
              </option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
            </select>

            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              placeholder="Escribe tu mensaje..."
              required
            ></textarea>

            {/* Campo oculto estado inicial */}
            <input type="hidden" name="estado" value="1" />

            <button type="submit">Enviar PQRS</button>
          </form>
        </div>

        {/* Lista de PQRS recientes (ejemplo estático) */}
        <div className="pqrs-lista">
          <h2>Mis PQRS</h2>
          <ul>
            <li>
              <span className="tipo">Queja</span>
              <p className="texto">El sistema me impide agendar cita...</p>
              <span className="fecha">01/05/2025</span>
              <span className="estado estado-1">Pendiente</span>
            </li>
            <li>
              <span className="tipo">Sugerencia</span>
              <p className="texto">Sería útil un recordatorio por email.</p>
              <span className="fecha">28/04/2025</span>
              <span className="estado estado-2">En Proceso</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default PQRS;
