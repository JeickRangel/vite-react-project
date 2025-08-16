import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function AdminLayout({ children }) {
  return (
    <>
    {/* Cabecera fija para el administrador */}
      <Header />
      {/* 
        Aquí es donde se va a renderizar 
        la página específica (Inicio, Servicios, etc.)
      */}
      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Outlet /> {/* Aquí se cargan las páginas de admin */}
      </main>
      <Footer />
    </>
  );
}
