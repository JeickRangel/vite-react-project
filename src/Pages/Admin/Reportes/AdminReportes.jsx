// src/components/AdminReportes/AdminReportes.jsx
import React, { useEffect, useMemo, useState } from "react";
import GraficoPrueba from "./GraficoPrueba";     // BarChart por día
import GraficoCircular from "./GraficoCircular"; // Pie por servicio
import styles from "./AdminReportes.module.css";
import { API_BASE } from "../config/api";

//const API_BASE = "http://localhost/barberia_app/php";
export const API_BASE = "https://barberia-render.onrender.com/barberia_app/php"
const EP = {
  reservas: `${API_BASE}/reservas.php`,
  usuarios: `${API_BASE}/usuarios.php`,
  pqrs:     `${API_BASE}/pqrs.php`,
};

// utils
const pad2 = (n) => (n < 10 ? "0" + n : "" + n);
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// pequeño helper para juntar clases del módulo
const cx = (...args) => args.filter(Boolean).join(" ");

// mapa de estados → clase de badge del módulo
const badgeClass = (estado) => {
  const e = String(estado || "").toLowerCase();
  return cx(
    styles.badge,
    e === "pendiente"  ? styles.pendiente  : "",
    e === "confirmada" ? styles.confirmada : "",
    e === "completada" ? styles.completada : "",
    e === "cancelada"  ? styles.cancelada  : ""
  );
};

export default function AdminReportes() {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  // ===== Filtros =====
  const [fi, setFi] = useState(ymd(inicioMes));
  const [ff, setFf] = useState(ymd(hoy));
  const [estado, setEstado] = useState("todos");   // todos | pendiente | confirmada | completada | cancelada
  const [servicio, setServicio] = useState("");    // texto contiene
  const [empleadoId, setEmpleadoId] = useState(""); // si luego agregas selector real
  const [cliente, setCliente] = useState("");      // texto contiene nombre

  // ===== Datos =====
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [reservas, setReservas] = useState([]); // reservas filtradas desde el back
  const [usuarios, setUsuarios] = useState([]); // para KPI
  const [pqrs, setPqrs] = useState([]);         // para KPI

  // ===== Cargar base (usuarios/pqrs una vez) =====
  useEffect(() => {
    (async () => {
      try {
        const uRes = await fetch(EP.usuarios);
        const uData = await uRes.json();
        setUsuarios(Array.isArray(uData) ? uData : []);

        try {
          const pRes = await fetch(`${EP.pqrs}?estado=pendiente`);
          const pData = await pRes.json();
          setPqrs(Array.isArray(pData) ? pData : []);
        } catch {
          setPqrs([]);
        }
      } catch {
        // silencioso
      }
    })();
  }, []);

  // ===== Buscar reservas según filtros =====
  const cargar = async () => {
    setLoading(true);
    setMsg("");
    try {
      const qs = new URLSearchParams({
        fecha_inicio: fi,
        fecha_fin: ff,
      });
      if (estado !== "todos") qs.append("estado", estado);
      if (servicio.trim())    qs.append("servicio_like", servicio.trim());
      if (cliente.trim())     qs.append("cliente_like", cliente.trim());
      if (empleadoId)         qs.append("empleado_id", empleadoId);

      const rRes = await fetch(`${EP.reservas}?` + qs.toString());
      const rData = await rRes.json();
      setReservas(Array.isArray(rData) ? rData : []);
    } catch {
      setMsg("No se pudieron cargar las reservas.");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);

  const limpiar = () => {
    setFi(ymd(inicioMes));
    setFf(ymd(hoy));
    setEstado("todos");
    setServicio("");
    setCliente("");
    setEmpleadoId("");
  };

  // ===== KPIs =====
  const kpis = useMemo(() => {
    const normEstado = (s) => (s || "").toLowerCase();
    const total = reservas.length;
    const comp = reservas.filter((r) => normEstado(r.estado) === "completada").length;
    const conf = reservas.filter((r) => normEstado(r.estado) === "confirmada").length;
    const pend = reservas.filter((r) => normEstado(r.estado) === "pendiente").length;
    const canc = reservas.filter((r) => normEstado(r.estado) === "cancelada").length;

    const ingresos = reservas
      .filter((r) => normEstado(r.estado) === "completada")
      .reduce((acc, r) => acc + (Number(r.precio) || 0), 0);

    return {
      total,
      estados: { comp, conf, pend, canc },
      ingresos,
      usuariosRegistrados: usuarios.length,
      pqrsPendientes: pqrs.length,
    };
  }, [reservas, usuarios, pqrs]);

  // ===== Datos para gráficas =====
  const dataBarras = useMemo(() => {
    const mapa = new Map();
    for (const r of reservas) {
      const f = r.fecha; // viene del back
      mapa.set(f, (mapa.get(f) || 0) + 1);
    }
    // construir todos los días del rango seleccionado
    const arr = [];
    const d0 = new Date(fi);
    const d1 = new Date(ff);
    const d = new Date(d0);
    while (d <= d1) {
      const key = ymd(d);
      arr.push({ fecha: key, citas: mapa.get(key) || 0 });
      d.setDate(d.getDate() + 1);
    }
    return arr;
  }, [reservas, fi, ff]);

  const dataServicios = useMemo(() => {
    const map = new Map();
    for (const r of reservas) {
      const nom = r.servicio || "Otro";
      map.set(nom, (map.get(nom) || 0) + 1);
    }
    return Array.from(map.entries()).map(([nombre, valor]) => ({ nombre, valor }));
  }, [reservas]);

  // ===== Exportar: CSV nativo =====
  const toCSV = (rows) => {
    if (!rows || rows.length === 0) return "";
    const headers = [
      "ID", "Fecha", "Hora", "Cliente", "Servicio",
      "Empleado", "Estado", "Precio"
    ];
    const lines = rows.map(r => ([
      r.id_reserva ?? "",
      r.fecha ?? "",
      (r.hora || "").slice(0,5),
      r.cliente ?? "",
      r.servicio ?? "",
      r.empleado ?? r.barbero ?? "",
      r.estado ?? "",
      (r.precio != null ? Number(r.precio) : "")
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")));
    return headers.join(",") + "\n" + lines.join("\n");
  };

  const descargarCSV = () => {
    const csv = toCSV(reservas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_reservas_${fi}_a_${ff}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /*  OPCIONAL: Excel con SheetJS
      1) npm i xlsx
      2) descomenta líneas abajo e importa dinámica.
  */
  // const descargarXLSX = async () => {
  //   const XLSX = await import("xlsx");
  //   const data = reservas.map(r => ({
  //     ID: r.id_reserva ?? "",
  //     Fecha: r.fecha ?? "",
 //     Hora: (r.hora || "").slice(0,5),
  //     Cliente: r.cliente ?? "",
  //     Servicio: r.servicio ?? "",
  //     Empleado: r.empleado ?? r.barbero ?? "",
  //     Estado: r.estado ?? "",
  //     Precio: r.precio != null ? Number(r.precio) : ""
  //   }));
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Reservas");
  //   XLSX.writeFile(wb, `reporte_reservas_${fi}_a_${ff}.xlsx`);
  // };

  return (
    <div className={styles.reportesContainer}>
      <h1 className={styles.titulo}>Reportes</h1>
      <p className={styles.descripcion}>Filtra, visualiza y descarga reportes personalizados.</p>
      {msg && <div className={styles.flash}>{msg}</div>}

      {/* Filtros */}
      <div className={styles.filtros}>
        <div className={styles.row}>
          <label>Desde</label>
          <input type="date" value={fi} onChange={(e)=>setFi(e.target.value)} />
          <label>Hasta</label>
          <input type="date" value={ff} onChange={(e)=>setFf(e.target.value)} />
          <label>Estado</label>
          <select value={estado} onChange={(e)=>setEstado(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div className={styles.row}>
          <label>Servicio</label>
          <input placeholder="Nombre contiene…" value={servicio} onChange={(e)=>setServicio(e.target.value)} />
          <label>Cliente</label>
          <input placeholder="Nombre contiene…" value={cliente} onChange={(e)=>setCliente(e.target.value)} />
          <label>Empleado ID</label>
          <input placeholder="Opcional" value={empleadoId} onChange={(e)=>setEmpleadoId(e.target.value)} />
        </div>

        <div className={cx(styles.row, styles.actions)}>
          <button className={styles.btn} onClick={cargar}>Aplicar filtros</button>
          <button className={cx(styles.btn, styles.ghost)} onClick={limpiar}>Limpiar</button>
          <div className={styles.spacer} />
          <button className={styles.btn} onClick={descargarCSV}>⬇️ CSV</button>
          {/* <button className={styles.btn} onClick={descargarXLSX}>⬇️ Excel</button> */}
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.gridReportes}>
        <div className={styles.card}><div className={styles.cardContent}>
          <div className={cx(styles.icono, styles.azul)}></div>
          <div><h2 className={styles.numero}>{loading ? "…" : kpis.total}</h2><p>Reservas en rango</p></div>
        </div></div>
        <div className={styles.card}><div className={styles.cardContent}>
          <div className={cx(styles.icono, styles.verde)}></div>
          <div><h2 className={styles.numero}>{kpis.usuariosRegistrados}</h2><p>Usuarios registrados</p></div>
        </div></div>
        <div className={styles.card}><div className={styles.cardContent}>
          <div className={cx(styles.icono, styles.morado)}></div>
          <div><h2 className={styles.numero}>{kpis.pqrsPendientes}</h2><p>PQRS pendientes</p></div>
        </div></div>
        <div className={styles.card}><div className={styles.cardContent}>
          <div className={cx(styles.icono, styles.naranja)}></div>
          <div><h2 className={styles.numero}>${(kpis.ingresos||0).toLocaleString()}</h2><p>Ingresos (completadas)</p></div>
        </div></div>
      </div>

      {/* Gráficas */}
      <div className={styles.estadisticas}>
        <h2>Estadísticas</h2>
        <div className={styles.contenedorGraficos}>
          <div className={styles.graphCard}>
            <GraficoPrueba data={dataBarras} xKey="fecha" yKey="citas" titulo="Citas por día" />
          </div>
          <div className={styles.graphCard}>
            <GraficoCircular data={dataServicios} dataKey="valor" nameKey="nombre" titulo="Distribución por servicio" />
          </div>
        </div>

        <div className={styles.panelResumen}>
          <div>Completadas: <strong>{kpis.estados.comp}</strong></div>
          <div>Confirmadas: <strong>{kpis.estados.conf}</strong></div>
          <div>Pendientes:  <strong>{kpis.estados.pend}</strong></div>
          <div>Canceladas:  <strong>{kpis.estados.canc}</strong></div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className={styles.tablaWrap}>
        <h3>Detalle de reservas</h3>
        <div className={styles.scrollX}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Empleado</th>
                <th>Estado</th>
                <th className={styles.num}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Cargando…</td></tr>
              ) : reservas.length === 0 ? (
                <tr><td colSpan="7">Sin resultados</td></tr>
              ) : reservas.map((r, i) => (
                <tr key={`${r.id_reserva || i}-${r.fecha}-${r.hora}`}>
                  <td>{r.fecha}</td>
                  <td>{(r.hora || "").slice(0,5)}</td>
                  <td>{r.cliente || "—"}</td>
                  <td>{r.servicio || "—"}</td>
                  <td>{r.empleado || r.barbero || "—"}</td>
                  <td><span className={badgeClass(r.estado)}>{r.estado}</span></td>
                  <td className={styles.num}>{r.precio != null ? `$${Number(r.precio).toLocaleString()}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
