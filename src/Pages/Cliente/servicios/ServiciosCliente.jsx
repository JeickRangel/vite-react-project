import React from "react";
import styles from "./ServiciosCliente.module.css";

const ServiciosCliente = () => {
  // Lista de servicios (puedes modificarla o traerla desde backend luego)
  const servicios = [
    { id: 1, nombre: "Corte de Cabello", descripcion: "Corte básico y estilizado según tu preferencia.", precio: "$20.000" },
    { id: 2, nombre: "Afeitado Clásico", descripcion: "Afeitado con toalla caliente y loción aftershave.", precio: "$15.000" },
    { id: 3, nombre: "Corte + Barba", descripcion: "Combo de corte de cabello y arreglo de barba.", precio: "$30.000" },
    { id: 4, nombre: "Tinte de Cabello", descripcion: "Coloración y tratamiento especial.", precio: "$40.000" },
    { id: 5, nombre: "Corte de Cabello", descripcion: "Corte básico y estilizado según tu preferencia.", precio: "$20.000" },
    { id: 6, nombre: "Afeitado Clásico", descripcion: "Afeitado con toalla caliente y loción aftershave.", precio: "$15.000" },
    { id: 7, nombre: "Corte + Barba", descripcion: "Combo de corte de cabello y arreglo de barba.", precio: "$30.000" },
    { id: 8, nombre: "Tinte de Cabello", descripcion: "Coloración y tratamiento especial.", precio: "$40.000" },
  ];

  return (
    <main className={styles.serviciosContenedor}>
      <h1>Servicios Disponibles</h1>
      <div className={styles.gridServicios}>
        {servicios.map((servicio) => (
          <div key={servicio.id} className={styles.servicioCard}>
            <h3>{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>
            <span className={styles.precio}>{servicio.precio}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ServiciosCliente;
