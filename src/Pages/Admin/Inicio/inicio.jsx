import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inicio.css";

const API_BASE = "http://localhost/barberia_app/php";
const EP = {
  reservas:  `${API_BASE}/reservas.php`,   // soporta ?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
  usuarios:  `${API_BASE}/usuarios.php`,   // GET lista
  servicios: `${API_BASE}/servicios.php`,  // GET lista (activo=1 recomendado)
  pqrs:      `${API_BASE}/pqrs.php`,       // GET lista, opcionalmente ?estado=pendiente
};

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function Inicio() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [reservasMes, setReservasMes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]); // si no existe endpoint, quedará []
  const [pqrs, setPqrs] = useState([]);

  // rango del mes actual
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fi = ymd(inicioMes);
  const ff = ymd(hoy);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        // 1) Reservas del mes
        const q = new URLSearchParams({ fecha_inicio: fi, fecha_fin: ff });
        const rRes = await fetch(`${EP.reservas}?` + q.toString());
        const rData = await rRes.json();
        setReservasMes(Array.isArray(rData) ? rData : []);

        // 2) Usuarios
        const uRes = await fetch(EP.usuarios);
        const uData = await uRes.json();
        setUsuarios(Array.isArray(uData) ? uData : []);

        // 3) Servicios (si no existe, atrapamos error y seguimos)
        try {
          const sRes = await fetch(EP.servicios);
          const sData = await sRes.json();
          setServicios(Array.isArray(sData) ? sData : []);
        } catch { setServicios([]); }

        // 4) PQRS (intentamos pendientes; si no, todo)
        let pData = [];
        try {
          const pRes = await fetch(`${EP.pqrs}?estado=pendiente`);
          pData = await pRes.json();
        } catch {
          const pRes = await fetch(EP.pqrs);
          pData = await pRes.json();
        }
        setPqrs(Array.isArray(pData) ? pData : []);
      } catch (e) {
        setMsg("No se pudieron cargar las métricas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []); // una sola carga

  // ===== KPIs =====
  const kpis = useMemo(() => {
    const citasMes = reservasMes.length;
    const usuariosRegistrados = usuarios.length;

    // servicios activos reales si tu endpoint trae campo `activo` o `estado`
    // si no, tomamos la cuenta de servicios distintos usados este mes como fallback
    const serviciosActivos =
      servicios.length > 0
        ? servicios.filter(s => String(s.activo ?? s.estado ?? 1) === "1").length
        : new Set(reservasMes.map(r => r.servicio).filter(Boolean)).size;

    // pqrs pendientes (si ya llegó filtrado a pendientes, usamos length)
    const pendientes = pqrs.length;

    return { citasMes, usuariosRegistrados, serviciosActivos, pendientes };
  }, [reservasMes, usuarios, servicios, pqrs]);

  // ===== Últimas novedades =====
  // combinamos: últimas 5 PQRS (por fecha desc) + últimas 5 reservas (por fecha+hora desc)
  const novedades = useMemo(() => {
    const parseFecha = (f, h="00:00:00") => new Date(`${f}T${(h || "00:00:00").slice(0,8)}`);

    const itemsPqrs = (Array.isArray(pqrs) ? pqrs : [])
      .map(p => ({
        tipo: "pqrs",
        ts: new Date(p.fecha || p.created_at || hoy), // ajusta si tu tabla es distinta
        texto: `📨 ${p.tipo || "PQRS"} de ${p.nombre || "cliente"} — ${p.estado || "estado"}.`,
        detalle: p.mensaje || "",
      }))
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 5);

    const itemsRes = (Array.isArray(reservasMes) ? reservasMes : [])
      .map(r => {
        const ts = parseFecha(r.fecha, r.hora);
        const estado = (r.estado || "").toLowerCase();
        return {
          tipo: "reserva",
          ts,
          texto: `📅 Reserva ${estado || "registrada"} — ${r.cliente || "Cliente"} (${r.servicio || "Servicio"})`,
          detalle: `${r.fecha}${r.hora ? " " + r.hora.slice(0,5) : ""}`,
        };
      })
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 5);

    return [...itemsPqrs, ...itemsRes]
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 6); // mostramos 6 novedades
  }, [pqrs, reservasMes]);

  return (
    <div className="inicio-container">
      {/* Bienvenida */}
      <section className="bienvenida">
        <h1>Bienvenido, Administrador 👋</h1>
        <p>
          Este panel te permitirá gestionar de forma web y accesible la lógica
          de tu barbería: administración de citas, servicios, usuarios y PQRS.
        </p>
        {msg && <div className="flash">{msg}</div>}
      </section>

      {/* Accesos rápidos */}
      <section className="accesos-rapidos">
        <h2>Accesos Rápidos</h2>
        <div className="cards-grid">
          <div className="card acceso">
            <h3>📅 Reservas</h3>
            <p>Gestiona y organiza las reservas de los clientes.</p>
            <button onClick={() => navigate("/admin/reservas")}>Ir a Citas</button>
          </div>
          <div className="card acceso">
            <h3>💈 Servicios</h3>
            <p>Administra los servicios disponibles en la barbería.</p>
            <button onClick={() => navigate("/admin/servicios")}>Ir a Servicios</button>
          </div>
          <div className="card acceso">
            <h3>👤 Usuarios</h3>
            <p>Gestiona barberos, clientes y administradores.</p>
            <button onClick={() => navigate("/admin/AdminUsuarios")}>Ir a Usuarios</button>
          </div>
          <div className="card acceso">
            <h3>📨 PQRS</h3>
            <p>Visualiza y responde peticiones, quejas o sugerencias.</p>
            <button onClick={() => navigate("/admin/AdminPQRS")}>Ir a PQRS</button>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="metricas">
        <h2>Métricas Generales</h2>
        <div className="cards-grid">
          <div className="card metrica">
            <h3>{loading ? "…" : kpis.citasMes}</h3>
            <p>Citas agendadas este mes</p>
          </div>
          <div className="card metrica">
            <h3>{loading ? "…" : kpis.serviciosActivos}</h3>
            <p>Servicios activos</p>
          </div>
          <div className="card metrica">
            <h3>{loading ? "…" : kpis.usuariosRegistrados}</h3>
            <p>Usuarios registrados</p>
          </div>
          <div className="card metrica">
            <h3>{loading ? "…" : kpis.pendientes}</h3>
            <p>PQRS pendientes</p>
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section className="novedades">
        <h2>Últimas Novedades</h2>
        {loading ? (
          <p>Cargando…</p>
        ) : novedades.length === 0 ? (
          <p>No hay novedades recientes.</p>
        ) : (
          <ul>
            {novedades.map((n, i) => (
              <li key={i}>
                {n.texto}
                {n.detalle ? <span className="detalle"> — {n.detalle}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
