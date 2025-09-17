import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import ClientLayout from "./Layouts/ClientLayout";
import EmployeeLayout from "./Layouts/EmployeeLayout";

//Paginas de administrador ↓
import AdminServicios from "./Pages/Admin/AdminServicios/AdminServicios";
import Inicio from "./Pages/Admin/Inicio/inicio";
import Reservas from "./Pages/Admin/Reservas/reservas";
import AdminBarberos from "./Pages/Admin/Barberos/AdminBarberos";
import Reportes from "./Pages/Admin/Reportes/AdminReportes";
import AdminConfiguracion from "./Pages/Admin/Configuracion/AdminConfiguracion";
import AdminPQRS from "./Pages/Admin/PQRS/AdminPQRS";
import AdminUsuarios from "./Pages/Admin/AdminUsuarios/AdminUsuarios";

// Páginas Cliente
import InicioCliente from "./Pages/Cliente/inicio/inicio";
import ReservarCita from "./Pages/Cliente/Reservar/reservar";
import ServiciosCliente from "./Pages/Cliente/servicios/ServiciosCliente";
import BarberosCliente from "./Pages/Cliente/barberos/BarberosCliente";
import MisCitas from "./Pages/Cliente/mis_citas/MisCitas";
import Contacto from "./Pages/Cliente/contacto/Contacto";
import PQRS from "./Pages/Cliente/PQRS/pqrs";

// Páginas Empleado
import InicioEmpleado from "./Pages/Empleado/InicioEmpleado/InicioEmpleado";
import MisCitasEmpleado from './Pages/Empleado/Citas_empleado/MisCitasEmpleado';
import ClientesEmpleado from "./Pages/Empleado/Clientes_empleado/ClientesEmpleado";

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
        <Route path="Inicio" element={<Inicio />} />
        <Route path="servicios" element={<AdminServicios />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="AdminBarberos" element={<AdminBarberos />} />
        <Route path="Reportes" element={<Reportes />} />
        <Route path="AdminConfiguracion" element={<AdminConfiguracion />} />
        <Route path="AdminPQRS" element={<AdminPQRS />} />
        <Route path="AdminUsuarios" element={<AdminUsuarios />} />
        {/* más módulos */}
        
      </Route>

      {/* Rutas para Cliente */}
      <Route path="/cliente" element={<ClientLayout />}>
        <Route index element={<InicioCliente />} />
        <Route path="inicio" element={<InicioCliente />} />
        <Route path="reservar" element={<ReservarCita />} />
        <Route path="servicios" element={<ServiciosCliente />} />
        <Route path="BarberosCliente" element={<BarberosCliente />} />
        <Route path="MisCitas" element={<MisCitas />} />
        <Route path="Contacto" element={<Contacto />} />
        <Route path="PQRS" element={<PQRS />} />
        {/* Aquí puedes agregar más rutas del cliente */}
      </Route>

      {/* Rutas para Empleado */}
      <Route path="/empleado" element={<EmployeeLayout />}>
        <Route index element={<InicioEmpleado />} />
        <Route path="InicioEmpleado" element={<InicioEmpleado />} />
        <Route path="MisCitasEmpleado" element={<MisCitasEmpleado />} />
        <Route path="ClientesEmpleado" element={<ClientesEmpleado />} />
        {/* Aquí puedes agregar más rutas del empleado */}
      </Route>


    </Routes>
  );
}


