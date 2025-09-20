// src/utils/auth.js
export function setUser(user) {
  localStorage.setItem("usuario", JSON.stringify(user));
}

export function getUser() {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem("usuario");
}

export function isLoggedIn() {
  return !!getUser();
}

export function hasRole(allowed) {
  const u = getUser();
  if (!u) return false;
  const allowedArr = Array.isArray(allowed) ? allowed : [allowed];
  return allowedArr.includes(Number(u.rol));
}

export function roleHome(rol) {
  switch (Number(rol)) {
    case 1:
      return "/admin/Inicio";
    case 2:
      return "/Empleado/InicioEmpleado";
    default:
      return "/cliente/inicio";
  }
}
