import React, { useState } from "react";
import styles from "./ReportesEmpleado.module.css"; // Importamos el CSS Module
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ReportesEmpleado = () => {
  // Datos simulados (puedes reemplazarlos luego con fetch)
  const [citas] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      servicio: "Corte",
      fecha: "2025-09-10",
      estado: "Completada",
      precio: 25000,
    },
    {
      id: 2,
      cliente: "Ana Gómez",
      servicio: "Afeitado",
      fecha: "2025-09-11",
      estado: "Cancelada",
      precio: 15000,
    },
    {
      id: 3,
      cliente: "Carlos Ruiz",
      servicio: "Corte",
      fecha: "2025-09-12",
      estado: "Pendiente",
      precio: 25000,
    },
    {
      id: 4,
      cliente: "María López",
      servicio: "Peinado",
      fecha: "2025-09-13",
      estado: "Completada",
      precio: 30000,
    },
  ]);

  // Resumen de las citas
  const totalCitas = citas.length;
  const completadas = citas.filter((c) => c.estado === "Completada").length;
  const canceladas = citas.filter((c) => c.estado === "Cancelada").length;
  const pendientes = citas.filter((c) => c.estado === "Pendiente").length;
  const ingresos = citas
    .filter((c) => c.estado === "Completada")
    .reduce((sum, c) => sum + c.precio, 0);

  // Datos para gráficas
  const dataEstados = [
    { name: "Completadas", value: completadas },
    { name: "Canceladas", value: canceladas },
    { name: "Pendientes", value: pendientes },
  ];

  const dataBarras = [
    { dia: "Lun", citas: 3 },
    { dia: "Mar", citas: 4 },
    { dia: "Mié", citas: 2 },
    { dia: "Jue", citas: 5 },
    { dia: "Vie", citas: 6 },
    { dia: "Sáb", citas: 4 },
  ];

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

  return (
    <div className={styles.reportesContainer}>
      <h2>📊 Reportes del Empleado</h2>

      {/* Tarjetas de resumen */}
      <div className={styles.tarjetas}>
        <div className={`${styles.tarjeta} ${styles.total}`}>
          <h3>Total Citas</h3>
          <p>{totalCitas}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.completadas}`}>
          <h3>Completadas</h3>
          <p>{completadas}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.canceladas}`}>
          <h3>Canceladas</h3>
          <p>{canceladas}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.pendientes}`}>
          <h3>Pendientes</h3>
          <p>{pendientes}</p>
        </div>
        <div className={`${styles.tarjeta} ${styles.ingresos}`}>
          <h3>Ingresos</h3>
          <p>${ingresos.toLocaleString()}</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className={styles.graficas}>
        <div className={styles.grafica}>
          <h4>Citas por Día</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="citas" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.grafica}>
          <h4>Estado de las Citas</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataEstados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {dataEstados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className={styles.tablaContainer}>
        <h4>Detalle de Citas</h4>
        <table className={styles.tablaCitas}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.cliente}</td>
                <td>{cita.servicio}</td>
                <td>{cita.fecha}</td>
                <td>{cita.estado}</td>
                <td>${cita.precio.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 👇 Exportación default (asegura que App.jsx lo pueda importar)
export default ReportesEmpleado;
