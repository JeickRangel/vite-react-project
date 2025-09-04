import './inicio.css';
import barberiaAccion from "../../../assets/Barberia-en-accion.png"


export default function InicioCliente() {
  return (
    <div>
      {/* Sección de bienvenida */}
      <section className="bienvenida">
        <h1>¡Qué gusto tenerte aquí!</h1>
        <p>Barbershop</p>
      </section>

      {/* Banner */}
      <section className="banner">
        <img src={barberiaAccion} alt="Barbería-en-acción" />
      </section>

      {/* Recientes */}
      <section className="recientes">
        <h2>Recientes</h2>
        <div className="citas-grid">
          <div className="cita-card">
            <h3>Cristian</h3>
            <p>Corte Básico</p>
            <span>5/03/2024</span>
          </div>
          <div className="cita-card">
            <h3>Andrés</h3>
            <p>Limpieza facial</p>
            <span>7/03/2024</span>
          </div>
          <div className="cita-card">
            <h3>Mariana</h3>
            <p>Corte y barba</p>
            <span>5/02/2024</span>
          </div>
          <div className="cita-card">
            <h3>Robert</h3>
            <p>Decoloración</p>
            <span>14/01/2024</span>
          </div>
          <div className="cita-card">
            <h3>Jairo</h3>
            <p>Corte Básico</p>
            <span>10/01/2024</span>
          </div>
          <div className="cita-card">
            <h3>Sebastián</h3>
            <p>Corte Básico</p>
            <span>20/12/2023</span>
          </div>
        </div>
      </section>
    </div>
  );
}
