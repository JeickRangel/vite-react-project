// src/Layouts/ClientLayout.jsx
import { Outlet } from "react-router-dom";
import HeaderCliente from "../components/Header/HeaderCliente";
import FooterCliente from "../components/Footer/FooterCliente";

export default function ClientLayout() {
  return (
    <>
      {/* Cabecera fija para el cliente */}
      <HeaderCliente />
      
      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Outlet /> {/* Aquí se renderizan las páginas del cliente */}
      </main>
      
      <FooterCliente />
    </>
  );
}
