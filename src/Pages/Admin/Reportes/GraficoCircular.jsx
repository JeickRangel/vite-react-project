// src/components/AdminReportes/GraficoCircular.jsx
import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const colores = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

export default function GraficoCircular({
  data = [],
  dataKey = "valor",
  nameKey = "nombre",
  titulo = "Distribución",
}) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <h4 style={{ margin: "8px 0 12px" }}>{titulo}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colores[i % colores.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
