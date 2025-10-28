// src/components/AdminReportes/GraficoPrueba.jsx
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function GraficoPrueba({ data = [], xKey = "fecha", yKey = "citas", titulo = "Citas por día" }) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <h4 style={{ margin: "8px 0 12px" }}>{titulo}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
