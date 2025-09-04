import React from "react";
import "./reservar.css";

export default function ReservarCita() {
  return (
    <main className="reservar-contenedor">
      <div className="reservar-caja">
        <h2>Reserva tu cita</h2>
        <form>
          {/* Servicio */}
          <label htmlFor="servicio">Servicio</label>
          <select id="servicio" name="servicio" required>
            <option value="" disabled selected>
              Elige un servicio
            </option>
            <option value="1">Corte de cabello</option>
            <option value="2">Barba</option>
            <option value="3">Corte + Barba</option>
          </select>

          {/* Barbero */}
          <label htmlFor="barbero">Barbero</label>
          <select id="barbero" name="barbero" required>
            <option value="" disabled selected>
              Elige un barbero
            </option>
            <option value="5">Diana</option>
            <option value="7">Luis</option>
            <option value="9">Ana</option>
          </select>

          {/* Fecha */}
          <label htmlFor="fecha">Fecha</label>
          <input type="date" id="fecha" name="fecha" required />

          {/* Hora */}
          <label htmlFor="hora">Hora</label>
          <select id="hora" name="hora" required>
            <option value="" disabled selected>
              Elige una hora
            </option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
          </select>

          <button type="submit">Confirmar cita</button>
        </form>
      </div>
    </main>
  );
}
