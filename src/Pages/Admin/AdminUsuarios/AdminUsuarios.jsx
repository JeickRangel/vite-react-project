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
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    fetch("/barberiaApp/php/usuarios.php")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error cargando usuarios:", error));
  }, []);

  const obtenerNombreRol = (valor) => {
    switch (String(valor)) {
      case "1":
        return "Administrador";
      case "2":
        return "Cliente";
      case "3":
        return "Empleado";
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
    setUsuarioEditando(null);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setMensaje("");
    // Validaciones y fetch aquí...
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
              {/* ... resto de inputs */}
              <button type="submit" className={styles.botonGuardar}>
                Guardar
              </button>
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
