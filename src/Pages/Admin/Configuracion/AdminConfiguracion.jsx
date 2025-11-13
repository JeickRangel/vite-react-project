import React, { useEffect, useState } from "react";
import styles from "./AdminConfiguracion.module.css";
import { API_BASE } from "/src/config/api";

/* ====== ENDPOINTS ====== */

const EP = {
  settings: `${API_BASE}/settings.php`,   // GET (todo) / PUT (parcial)  { calendar: {...} }
  backup:   `${API_BASE}/backup.php`,     // GET -> descarga .sql
};

/* Util: horarios por defecto */
const defaultCalendar = {
  // lun..dom: { abierto: bool, desde: "HH:MM", hasta: "HH:MM" }
  monday:    { abierto: true,  desde: "08:00", hasta: "18:00" },
  tuesday:   { abierto: true,  desde: "08:00", hasta: "18:00" },
  wednesday: { abierto: true,  desde: "08:00", hasta: "18:00" },
  thursday:  { abierto: true,  desde: "08:00", hasta: "18:00" },
  friday:    { abierto: true,  desde: "08:00", hasta: "18:00" },
  saturday:  { abierto: true,  desde: "08:00", hasta: "14:00" },
  sunday:    { abierto: false, desde: "00:00", hasta: "00:00" },
  // festivos como array de YYYY-MM-DD
  holidays: [],
};

const dayLabel = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function AdminConfiguracion() {
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState("");
  const [calendar, setCalendar] = useState(defaultCalendar);
  const [newHoliday, setNewHoliday] = useState(""); // YYYY-MM-DD

  /* ====== cargar settings (solo calendario si existe) ====== */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setFlash("");
      try {
        const res = await fetch(EP.settings);
        const data = await res.json();
        const cal = data?.calendar;
        if (cal && typeof cal === "object") {
          // merge defensivo por si faltan claves
          setCalendar({
            ...defaultCalendar,
            ...cal,
            holidays: Array.isArray(cal.holidays) ? cal.holidays : [],
          });
        } else {
          setCalendar(defaultCalendar);
        }
      } catch {
        setFlash("No se pudieron cargar las configuraciones. Usando valores por defecto.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ====== handlers ====== */
  const toggleAbierto = (k) =>
    setCalendar((p) => ({ ...p, [k]: { ...p[k], abierto: !p[k].abierto } }));

  const setHora = (k, field, value) =>
    setCalendar((p) => ({ ...p, [k]: { ...p[k], [field]: value } }));

  const addHoliday = () => {
    if (!newHoliday) return;
    setCalendar((p) => {
      const hs = new Set(p.holidays || []);
      hs.add(newHoliday);
      return { ...p, holidays: Array.from(hs).sort() };
    });
    setNewHoliday("");
  };

  const removeHoliday = (day) =>
    setCalendar((p) => ({
      ...p,
      holidays: (p.holidays || []).filter((d) => d !== day),
    }));

  const saveCalendar = async () => {
    try {
      const res = await fetch(EP.settings, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendar }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "Error");
      setFlash("✅ Calendario guardado.");
    } catch {
      setFlash("❌ No se pudo guardar el calendario.");
    }
  };

  const generarBackup = async () => {
    try {
      // descarga directa del .sql
      const a = document.createElement("a");
      a.href = `${EP.backup}?t=${Date.now()}`;
      a.download = ""; // el servidor pone nombre
      document.body.appendChild(a);
      a.click();
      a.remove();
      setFlash("📦 Backup iniciado (revisa tus descargas).");
    } catch {
      setFlash("❌ No se pudo iniciar el backup.");
    }
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Configuración</h1>
      {flash && <div className={styles.flash}>{flash}</div>}

      {/* === Copia de seguridad === */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Copia de seguridad</h2>
          <p className={styles.cardSub}>Descarga un respaldo (.sql) de tu base de datos.</p>
        </div>
        <div className={styles.actionsRow}>
          <button className={styles.btnPrimary} onClick={generarBackup}>
            ⬇️ Generar backup ahora
          </button>
          <span className={styles.hint}>Se descarga un archivo .sql usando mysqldump.</span>
        </div>
      </section>

      {/* === Calendario laboral === */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Calendario laboral</h2>
          <p className={styles.cardSub}>Define días/horarios de atención y festivos.</p>
        </div>

        {loading ? (
          <div className={styles.empty}>Cargando…</div>
        ) : (
          <>
            <div className={styles.grid}>
              {Object.keys(dayLabel).map((k) => (
                <div key={k} className={styles.dayRow}>
                  <div className={styles.dayTitle}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={!!calendar[k].abierto}
                        onChange={() => toggleAbierto(k)}
                      />
                      <span className={styles.slider} />
                    </label>
                    <span>{dayLabel[k]}</span>
                  </div>

                  <div className={styles.hours}>
                    <label>
                      Desde
                      <input
                        type="time"
                        value={calendar[k].desde}
                        disabled={!calendar[k].abierto}
                        onChange={(e) => setHora(k, "desde", e.target.value)}
                      />
                    </label>
                    <label>
                      Hasta
                      <input
                        type="time"
                        value={calendar[k].hasta}
                        disabled={!calendar[k].abierto}
                        onChange={(e) => setHora(k, "hasta", e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.holidaysBox}>
              <h3 className={styles.subTitle}>Festivos / cierres especiales</h3>
              <div className={styles.holidayRow}>
                <input
                  type="date"
                  value={newHoliday}
                  onChange={(e) => setNewHoliday(e.target.value)}
                  className={styles.input}
                />
                <button className={styles.btnGhost} onClick={addHoliday}>Agregar</button>
              </div>

              {(calendar.holidays || []).length === 0 ? (
                <div className={styles.empty}>Sin festivos definidos.</div>
              ) : (
                <ul className={styles.holidayList}>
                  {calendar.holidays.map((d) => (
                    <li key={d} className={styles.holidayItem}>
                      <span>{d}</span>
                      <button className={styles.btnDanger} onClick={() => removeHoliday(d)}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.actionsRow}>
              <button className={styles.btnPrimary} onClick={saveCalendar}>💾 Guardar calendario</button>
              <span className={styles.hint}>El front guarda en <code>settings.php</code> la clave <code>calendar</code>.</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
