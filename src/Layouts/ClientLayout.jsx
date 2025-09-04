// src/Layouts/ClientLayout.jsx
import { Outlet } from "react-router-dom";
import ClientHeader from "../components/Header/HeaderCliente";
import ClientFooter from "../components/Footer/FooterCliente";

export default function ClientLayout() {
  return (
    <>
      {/* Cabecera fija para el cliente */}
      <ClientHeader />
      
      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Outlet /> {/* Aquí se renderizan las páginas del cliente */}
      </main>
      
      <ClientFooter />
    </>
  );
}
