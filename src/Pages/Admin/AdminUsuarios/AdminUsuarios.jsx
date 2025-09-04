import { useState, useEffect } from 'react'; // Hooks de React para manejar estado y efectos (cargar datos al inicio)
import './AdminUser.css'; // Importa los estilos

function AdminUsuarios() { //componente principal
  const [modalAbierto, setModalAbierto] = useState(false); // Mostrar/ocultar el formulario flotante
  const [nombre, setNombre] = useState(''); // campo Nombre del usuario a crear o editar
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo_documento, setTipoDoc] = useState('');
  const [numero_documento, setNumeroDoc] = useState('');
  const [rol, setRol] = useState(''); // Rol del usuario 
  const [mensaje, setMensaje] = useState(''); // Mensajes de error o éxito
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios de la base de datos
  const [usuarioEditando, setUsuarioEditando] = useState(null); // Si se está editando un usuario, guarda su info

  // Este bloque se ejecuta solo una vez cuando el componente se monta. Usa fetch para consultar usuarios.php y traer la lista de usuarios
  useEffect(() => {
    fetch('/barberiaApp/php/usuarios.php')//Trae la lista de usuarios desde esta ubicación
      .then(res => res.json()) // Convierte la respuesta en JSON
      .then(data => setUsuarios(data)) // Guarda los usuarios en el estado
      .catch(error => console.error('Error cargando usuarios:', error)); // Muestra errores si los hay
  }, []);
//Convierte el # que correspone con cada Rol
  const obtenerNombreRol = (valor) => {
  switch (String(valor)) {
    case '1': return 'Administrador';
    case '2': return 'Cliente';
    case '3': return 'Empleado';
  }
  };

  //Abrir, cerrar y limpiar el modal
  const abrirModal = () => setModalAbierto(true); // Abre el modal
  const cerrarModal = () => {
    setModalAbierto(false); // Cierra el modal
    limpiarFormulario(); // Limpia todos los campos del formulario
  };

  const limpiarFormulario = () => {
    // Reinicia todos los campos del formulario
    setNombre('');
    setCorreo('');
    setGenero('');
    setTipoDoc('');
    setNumeroDoc('');
    setRol('');
    setMensaje('');
    setUsuarioEditando(null); // Salir del modo edición
  };

  //Crear o editar el usuario de la bd, revisa que se diligecie correctamente

  const manejarEnvio = (e) => {
  e.preventDefault(); // Previene el comportamiento por defecto (recargar página)
  setMensaje('');

  const regexCorreo = /^\S+@\S+\.\S+$/; // Validación para correos

  // Validaciones del formulario
  if (!nombre.trim()) return setMensaje('Por favor, ingresa el nombre.');
  if (!correo.trim()) return setMensaje('Por favor, ingresa el correo.');
  if (!regexCorreo.test(correo)) return setMensaje('Por favor, ingresa un correo válido.');
  if (!rol) return setMensaje('Por favor, selecciona un rol.');

  // Datos que se van a enviar al backend
  const usuarioData = {
    id: usuarioEditando?.id,
    nombre,
    correo,
    genero,
    tipo_documento,
    numero_documento,
    rol: parseInt(rol)
  };

  const metodo = usuarioEditando ? 'PUT' : 'POST'; // Si estamos editando, usamos PUT. Si no, POST.

  // Enviar los datos al backend
  fetch('http://localhost/barberiaApp/php/usuarios.php', {//Peticiones HTTP desde JavaScript
    method: metodo, // puede ser 'POST' (nuevo) o 'PUT' (editar)
    headers: {
      'Content-Type': 'application/json' // Le dice al servidor que va a enviar JSON
    },
    body: JSON.stringify(usuarioData) //convierte ese objeto en texto JSON para poder enviarlo al servidor.
  })
    .then(res => res.json())//Procesa la respuesta
    //Verifica si fue exitoso
    .then(data => {
      if (data.success) {
        setMensaje(usuarioEditando ? 'Usuario actualizado ✅' : 'Usuario creado ✅');
        setUsuarioEditando(null);
        // Vuelve a refrescar la lista desde el servidor
        fetch('/barberiaApp/php/usuarios.php')
          .then(res => res.json())
          .then(data => {
            setUsuarios(data);
            cerrarModal();
          });
      } else {//Error desde el backend
        setMensaje('Error: ' + (data.message || 'Error desconocido'));
      }
    })//Error de conexion
    .catch(error => {
      console.error('❌ Error en la conexión:', error);
      setMensaje('❌ Error en la conexión con el servidor');
    });
};


//Función para llenar el formulario con datos de un usuario y editarlo
  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario); // Guardamos el usuario que estamos editando
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setGenero(usuario.genero);
    setTipoDoc(usuario.tipo_documento);
    setNumeroDoc(usuario.numero_documento);
    setRol(usuario.rol.toString()); // Convertimos a string para que funcione con el select
    setModalAbierto(true); // Abrimos el modal
  };

  //Eliminar usuario con confirmación
  const eliminarUsuario = (id) => {
  const confirmar = window.confirm("¿Estás seguro de eliminar este usuario?");
  if (confirmar) {
    fetch('/barberiaApp/php/usuarios.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id }) // Enviar el id del usuario a eliminar
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsuarios(prev => prev.filter((u) => u.id !== id)); // Quitar el usuario de la tabla
        } else {
          alert('Error al eliminar: ' + (data.message || 'Error desconocido'));
        }
      })
      .catch(error => {
        alert('❌ Error de conexión al eliminar');
        console.error(error);
      });
  }
};


  return (
    <>{/**Vista del componente ↓ */}
      <header>
        <div className="logo-titulo">
          <h1>Administración de Usuarios</h1>
        </div>
        <div className="boton-derecha">
          <button onClick={abrirModal}>+ Nuevo Usuario</button>
        </div>
      </header>
    {/* Formulario flotante para crear o editar */}
      {modalAbierto && (
        <div className="modal" onClick={(e) => e.target.classList.contains('modal') && cerrarModal()}>
          <div className="modal-contenido">
            <span className="cerrar" onClick={cerrarModal}>&times;</span>
            <h2>Crear / Editar Usuario</h2>
            <form onSubmit={manejarEnvio}>
              <label>Nombre:</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <label>Correo:</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              <label>Género:</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
                <option value="">Seleccionar...</option>
                <option>Masculino</option>
                <option>Femenino</option>
              </select>
              <label>Tipo Documento:</label>
              <select value={tipo_documento} onChange={(e) => setTipoDoc(e.target.value)} required>
                <option value="">Seleccionar...</option>
                <option  value="CC">Cedula</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cedula Extranjeria</option>
              </select>
              <label>Número Documento:</label>
              <input value={numero_documento} onChange={(e) => setNumeroDoc(e.target.value)} required />
              <label>Rol:</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                <option value="">Seleccionar...</option>
                <option value="1">Administrador</option>
                <option value="2">Barbero</option>
                <option value="3">Cliente</option>
              </select>

              {mensaje && (
                <div style={{ marginTop: '10px', color: mensaje.includes('éxito') ? 'green' : 'red' }}>
                  {mensaje}
                </div>
              )}
              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/**Tabla con usuarios de la base de datos ↓ */}
      <main>
        <section className="tabla-usuarios">
          <table>
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
            {/* Muestra cada usuario de la bd */}
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
                    <button className="editar" onClick={() => editarUsuario(usuario)}>Editar</button>
                    <button className="eliminar" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <p>JP Systems B&S © 2025</p>
      </footer>
    </>
  );
}
//Exportacion del componente
export default AdminUsuarios;