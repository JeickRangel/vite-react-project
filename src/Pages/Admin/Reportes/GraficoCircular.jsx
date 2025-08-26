import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const datosServicios = [
  { nombre: "Corte", valor: 40 },
  { nombre: "Barba", valor: 25 },
  { nombre: "Coloración", valor: 35 },
];

const colores = ["#0088FE", "#00C49F", "#FFBB28"];

export default function GraficoCircular() {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={datosServicios}
        dataKey="valor"
        nameKey="nombre"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label
      >
        {datosServicios.map((entrada, index) => (
          <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
