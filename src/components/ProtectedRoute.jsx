// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser, roleHome } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const user = getUser();

  // No logueado -> al login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logueado pero sin rol permitido -> a su home real
  if (allowedRoles && !allowedRoles.includes(Number(user.rol))) {
    return <Navigate to={roleHome(user.rol)} replace />;
  }

  // OK -> renderiza las rutas hijas
  return <Outlet />;
}
