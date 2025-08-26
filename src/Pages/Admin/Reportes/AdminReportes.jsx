import React from "react";
import GraficoPrueba from "./GraficoPrueba";//Uso de libreria Recharts
import GraficoCircular from "./GraficoCircular";
import "./AdminReportes.css";

export default function AdminReportes() {
  return (
    <div className="reportes-container">
      <h1 className="titulo">Reportes</h1>
      <p className="descripcion">
        Visualiza estadísticas generales sobre citas, usuarios, servicios y barbería.
      </p>

      {/* Tarjetas de resumen */}
      <div className="grid-reportes">
        <div className="card">
          <div className="card-content">
            <div className="icono azul"></div>
            <div>
              <h2 className="numero">150</h2>
              <p>Citas este mes</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="icono verde"></div>
            <div>
              <h2 className="numero">45</h2>
              <p>Usuarios registrados</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="icono morado"></div>
            <div>
              <h2 className="numero">12</h2>
              <p>Servicios activos</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="icono naranja"></div>
            <div>
              <h2 className="numero">8</h2>
              <p>PQRS pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de estadísticas */}
      <div className="estadisticas">
        <h2>Estadísticas Mensuales</h2>
        <div>
      <h2>Reportes del Sistema</h2>
      <div className="contenedor-graficos">
      <GraficoPrueba />
      <GraficoCircular />
    </div>
    </div>
      </div>
    </div>
  );
}
