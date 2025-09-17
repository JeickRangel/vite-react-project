import React from "react";
import styles from "./BarberosCliente.module.css";
// Si usas imágenes desde /assets, cámbialas por imports como hicimos antes
import perfil1 from "../../../assets/Profile1.jpg";
import perfil2 from "../../../assets/Profile2.jpg";
import perfil3 from "../../../assets/Profile6.jpg";
import perfil4 from "../../../assets/Profile3.jpg";
import perfil5 from "../../../assets/Profile4.jpg";
import perfil6 from "../../../assets/Profile5.jpeg";

const BarberosCliente = () => {
  // Aquí podrías luego traer los datos desde tu backend en lugar de array estático
  const barberos = [
    { id: 1, nombre: "Diana Pérez", especialidad: "Corte clásico", foto: perfil1 },
    { id: 2, nombre: "Luis Ramírez", especialidad: "Barba y estilizado", foto: perfil2 },
    { id: 3, nombre: "Ana Gómez", especialidad: "Cortes modernos", foto: perfil3 },
    { id: 4, nombre: "Luis Manuel", especialidad: "Corte clásico", foto: perfil4 },
    { id: 5, nombre: "Roberto Carlos", especialidad: "Barba y estilizado", foto: perfil5 },
    { id: 6, nombre: "Andrés Díaz", especialidad: "Cortes modernos", foto: perfil6 },
  ];

  return (
    <main className={styles.barberosContenedor}>
      <h1>Nuestros Barberos</h1>
      <div className={styles.gridBarberos}>
        {barberos.map((barbero) => (
          <div key={barbero.id} className={styles.barberoCard}>
            <img src={barbero.foto} alt={barbero.nombre} />
            <h3>{barbero.nombre}</h3>
            <p className={styles.especialidad}>
              Especialidad: {barbero.especialidad}
            </p>
            <button>Ver disponibilidad</button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BarberosCliente;
