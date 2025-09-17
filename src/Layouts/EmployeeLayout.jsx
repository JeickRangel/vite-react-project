// src/Layouts/ClientLayout.jsx
import { Outlet } from "react-router-dom";
import HeaderEmpleado from "../components/Header/HeaderEmpleado";
import FooterEmpleado from "../components/Footer/FooterEmpleado";

export default function EmployeeLayout() {
  return (
    <>
      {/* Cabecera fija para el cliente */}
      <HeaderEmpleado />
      
      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Outlet /> {/* Aquí se renderizan las páginas del cliente */}
      </main>
      
      <FooterEmpleado />
    </>
  );
}
