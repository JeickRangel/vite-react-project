import React, { useState } from "react";
import "./AdminConfiguracion.css";

export default function AdminConfiguracion() {
  // Estados para manejar datos de prueba
  const [barberia, setBarberia] = useState({
    nombre: "Barbería JP",
    direccion: "Calle 123 #45-67",
    telefono: "3001234567",
    logo: ""
  });

  const [notificaciones, setNotificaciones] = useState({
    correo: true,
    sms: false
  });

  const handleLogoChange = (e) => {
    setBarberia({ ...barberia, logo: URL.createObjectURL(e.target.files[0]) });
  };

  const generarBackup = () => {
    alert("¡Copia de seguridad generada con éxito! (Simulación)");
  };

  return (
    <div className="config-container">
      <h1>Configuración del Sistema</h1>

      {/* Información de la Barbería */}
      <section className="config-section">
        <h2>Información de la Barbería</h2>
        <label>
          Nombre:
          <input
            type="text"
            value={barberia.nombre}
            onChange={(e) =>
              setBarberia({ ...barberia, nombre: e.target.value })
            }
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            value={barberia.direccion}
            onChange={(e) =>
              setBarberia({ ...barberia, direccion: e.target.value })
            }
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            value={barberia.telefono}
            onChange={(e) =>
              setBarberia({ ...barberia, telefono: e.target.value })
            }
          />
        </label>
        <label>
          Logo:
          <input type="file" onChange={handleLogoChange} />
        </label>
        {barberia.logo && (
          <img src={barberia.logo} alt="Logo" className="logo-preview" />
        )}
      </section>

      {/* Configuración de Notificaciones */}
      <section className="config-section">
        <h2>Notificaciones</h2>
        <label>
          <input
            type="checkbox"
            checked={notificaciones.correo}
            onChange={(e) =>
              setNotificaciones({
                ...notificaciones,
                correo: e.target.checked
              })
            }
          />
          Enviar correos al crear o cancelar citas
        </label>
        <label>
          <input
            type="checkbox"
            checked={notificaciones.sms}
            onChange={(e) =>
              setNotificaciones({
                ...notificaciones,
                sms: e.target.checked
              })
            }
          />
          Enviar mensajes SMS
        </label>
      </section>

      {/* Copia de Seguridad */}
      <section className="config-section">
        <h2>Copia de Seguridad</h2>
        <button onClick={generarBackup}>Generar Backup</button>
      </section>
    </div>
  );
}
