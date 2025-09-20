import { useState, useEffect } from "react";
import styles from "./AdminUsuarios.module.css";

function AdminUsuarios() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [genero, setGenero] = useState("");
  const [tipo_documento, setTipoDoc] = useState("");
  const [numero_documento, setNumeroDoc] = useState("");
  const [rol, setRol] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // ✅ success o error
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    recargarUsuarios();
  }, []);

  const recargarUsuarios = () => {
    fetch("http://localhost/barberia_app/php/usuarios.php")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error cargando usuarios:", error));
  };

  const obtenerNombreRol = (valor) => {
    switch (String(valor)) {
      case "1":
        return "Administrador";
      case "2":
        return "Empleado";
      case "3":
        return "Cliente";
      default:
        return "";
    }
  };

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => {
    setModalAbierto(false);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setGenero("");
    setTipoDoc("");
    setNumeroDoc("");
    setRol("");
    setMensaje("");
    setTipoMensaje("");
    setUsuarioEditando(null);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    const usuarioData = {
      id: usuarioEditando?.id,
      nombre,
      correo,
      genero,
      tipo_documento,
      numero_documento,
      rol,
    };

    try {
      const res = await fetch("http://localhost/barberia_app/php/usuarios.php", {
        method: usuarioEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData),
      });

      const data = await res.json();
      if (data.status === "OK") {
        setTipoMensaje("success");
        setMensaje(data.message || "Guardado correctamente ✅");
        cerrarModal();
        recargarUsuarios();
      } else {
        setTipoMensaje("error");
        setMensaje(data.message || "Error desconocido");
      }
    } catch (error) {
      setTipoMensaje("error");
      setMensaje("Error de conexión con el servidor");
      console.error("Error:", error);
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setGenero(usuario.genero);
    setTipoDoc(usuario.tipo_documento);
    setNumeroDoc(usuario.numero_documento);
    setRol(usuario.rol);
    setModalAbierto(true);
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      const res = await fetch("http://localhost/barberia_app/php/usuarios.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`,
      });

      const data = await res.json();
      if (data.status === "OK") {
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } else {
        alert("Error al eliminar: " + (data.message || "Desconocido"));
      }
    } catch (error) {
      alert("❌ Error de conexión al eliminar");
      console.error(error);
    }
  };

  return (
    <div className={styles.contenedor}>
      <header className={styles.header}>
        <div className={styles.logoTitulo}>
          <h1>Administración de Usuarios</h1>
        </div>
        <div className={styles.botonDerecha}>
          <button onClick={abrirModal}>+ Nuevo Usuario</button>
        </div>
      </header>

      {modalAbierto && (
        <div
          className={styles.modal}
          onClick={(e) =>
            e.target.classList.contains(styles.modal) && cerrarModal()
          }
        >
          <div className={styles.modalContenido}>
            <span className={styles.cerrar} onClick={cerrarModal}>
              &times;
            </span>
            <h2>Crear / Editar Usuario</h2>
            <form onSubmit={manejarEnvio} className={styles.formulario}>
              <label>Nombre:</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <label>Correo:</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />

              <label>Género:</label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Seleccione</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>

              <label>Tipo de documento:</label>
              <select
                value={tipo_documento}
                onChange={(e) => setTipoDoc(e.target.value)}
                required
              >
                <option value="">Seleccione</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>

              <label>Número de documento:</label>
              <input
                value={numero_documento}
                onChange={(e) => setNumeroDoc(e.target.value)}
                required
              />

              <label>Rol:</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="">Seleccione</option>
                <option value="1">Administrador</option>
                <option value="2">Empleado</option>
                <option value="3">Cliente</option>
              </select>

              <button type="submit" className={styles.botonGuardar}>
                Guardar
              </button>

              {mensaje && (
                <p
                  className={
                    tipoMensaje === "success" ? styles.success : styles.error
                  }
                >
                  {mensaje}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <main>
        <section className={styles.tablaUsuarios}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Genero</th>
                <th>Tipo Documento</th>
                <th>Numero Documento</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.genero}</td>
                  <td>{usuario.tipo_documento}</td>
                  <td>{usuario.numero_documento}</td>
                  <td>{obtenerNombreRol(usuario.rol)}</td>
                  <td>
                    <button
                      className={styles.editar}
                      onClick={() => editarUsuario(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.eliminar}
                      onClick={() => eliminarUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>JP Systems B&S © 2025</p>
      </footer>
    </div>
  );
}

export default AdminUsuarios;
