import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const datosPrueba = [
  { mes: "Enero", citas: 30 },
  { mes: "Febrero", citas: 45 },
  { mes: "Marzo", citas: 20 },
];

export default function GraficoPrueba() {
  return (
    <BarChart width={500} height={300} data={datosPrueba}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="citas" fill="#8884d8" />
    </BarChart>
  );
}
