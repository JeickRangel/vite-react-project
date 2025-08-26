import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
//Aqui se importan los modulos ↓
import AdminServicios from "./Pages/Admin/AdminServicios/AdminServicios";
import Inicio from "./Pages/Admin/Inicio/inicio";
import Reservas from "./Pages/Admin/Reservas/reservas";
import AdminBarberos from "./Pages/Admin/Barberos/AdminBarberos";
import Reportes from "./Pages/Admin/Reportes/AdminReportes";
import AdminConfiguracion from "./Pages/Admin/Configuracion/AdminConfiguracion";
import AdminPQRS from "./Pages/Admin/PQRS/AdminPQRS";

export default function App() {
  return (
    <Routes>
      {/* 
        Ruta principal del administrador 
        - Usa AdminLayout para mantener un mismo diseño (Header, Footer, etc.)
        - Dentro de esta ruta puedes poner todas las sub-rutas del admin
      */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Inicio />} />
        <Route path="servicios" element={<AdminServicios />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="AdminBarberos" element={<AdminBarberos />} />
        <Route path="Reportes" element={<Reportes />} />
        <Route path="AdminConfiguracion" element={<AdminConfiguracion />} />
        <Route path="AdminPQRS" element={<AdminPQRS />} />
        {/* más módulos */}
        
      </Route>

      {/* Ruta por defecto: redirige a /admin/servicios */}
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}


