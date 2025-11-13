// src/components/PerfilEmpleado.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./PerfilEmpleado.module.css";
import { API_BASE } from "../config/api";

/* ====== CONFIG API ====== */
//const API_BASE = "http://localhost/barberia_app/php";

const EP = {
  usuarios: `${API_BASE}/usuarios.php`,
  upload:   `${API_BASE}/upload_foto.php`,
};

/* ====== FALLBACK AVATAR (SVG) ====== */
const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>\
<rect width='100%' height='100%' rx='80' fill='%231976d2'/>\
<text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='64' fill='white'>👤</text>\
</svg>";

export default function PerfilEmpleado({ currentEmployeeId: currentEmployeeIdProp }) {
  /* ===== Sesión empleado: prop o localStorage ===== */
  const empleadoId = useMemo(() => {
    if (currentEmployeeIdProp) return currentEmployeeIdProp;
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("usuario") ||
        localStorage.getItem("authUser");
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj?.id ?? obj?.user?.id ?? obj?.usuario?.id ?? null;
    } catch {
      return null;
    }
  }, [currentEmployeeIdProp]);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [empleado, setEmpleado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState(null); // {nombre, correo(RO), telefono, foto_url}

  // Cargar datos del empleado
  useEffect(() => {
    const cargar = async () => {
      if (!empleadoId) { setLoading(false); setMsg("No hay sesión de empleado"); return; }
      setLoading(true); setMsg("");
      try {
        const res = await fetch(`${EP.usuarios}?id=${empleadoId}`);
        const data = await res.json();
        if (!data) throw new Error("Empleado no encontrado");

        const perfil = {
          id: data.id,
          nombre: data.nombre,
          correo: data.correo,           // solo mostrar
          telefono: data.telefono || "",
          foto_url: data.foto_url || "",
          rol: data.rol_nombre || "",
          documento: data.numero_documento || "",
        };
        setEmpleado(perfil);
        setFormData(perfil);
      } catch (e) {
        setMsg("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [empleadoId]);

  const onImgError = (e) => {
    if (e.currentTarget.src !== FALLBACK_AVATAR) e.currentTarget.src = FALLBACK_AVATAR;
  };

  const onChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Subir archivo y guardar foto_url
  const onFotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("foto", file);
      const res = await fetch(EP.upload, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "Error al subir foto");
      setFormData((p) => ({ ...p, foto_url: data.url }));
    } catch (err) {
      alert("❌ No se pudo subir la foto");
    }
  };

  const guardar = async () => {
    if (!formData) return;
    try {
      // NO enviamos correo (solo lectura)
      const payload = {
        id: Number(formData.id),
        nombre: formData.nombre,
        telefono: formData.telefono,
        foto_url: formData.foto_url || null,
        genero: null,
        tipo_documento: null,
        numero_documento: formData.documento || null,
        rol: null, // opcional, si no deseas cambiar rol
      };
      const res = await fetch(EP.usuarios, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "OK") throw new Error(data.message || "Error al guardar");

      setEmpleado(formData);
      setEditando(false);
      setMsg("✅ Perfil actualizado");
    } catch (e) {
      setMsg("❌ No se pudo guardar el perfil");
    }
  };

  if (loading) return <div className={styles.peContainer}>Cargando…</div>;

  if (!empleado) return <div className={styles.peContainer}>{msg || "Perfil no disponible"}</div>;

  return (
    <div className={styles.peContainer}>
      <div className={styles.peTitleRow}>
        <span className={styles.peTitleIcon} aria-hidden="true">👤</span>
        <h2 className={styles.peTitleText}>Perfil del Empleado</h2>
      </div>

      {msg && <p className={styles.peFlash}>{msg}</p>}

      {!editando ? (
        <section className={styles.peCard}>
          <div className={styles.peLayout}>
            <img
              src={empleado.foto_url || FALLBACK_AVATAR}
              alt="Foto de perfil"
              className={styles.peAvatar}
              onError={onImgError}
            />
            <div className={styles.peInfo}>
              <p><span className={styles.peKey}>Nombre:</span> {empleado.nombre}</p>
              <p><span className={styles.peKey}>Correo:</span> {empleado.correo}</p>
              <p><span className={styles.peKey}>Documento:</span> {empleado.documento || "—"}</p>
              <p><span className={styles.peKey}>Rol:</span> {empleado.rol || "—"}</p>
              <p><span className={styles.peKey}>Teléfono:</span> {empleado.telefono || "—"}</p>

              <button type="button" className={styles.peBtnPrimary} onClick={() => setEditando(true)}>
                ✏️ Editar Perfil
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.peCard}>
          <h3 className={styles.peSubtitle}>Editar información</h3>

          <div className={styles.peFotoBox}>
            <img
              src={formData.foto_url || FALLBACK_AVATAR}
              alt="Foto de perfil"
              className={styles.peAvatar}
              onError={onImgError}
            />
            <input
              type="file"
              accept="image/*"
              onChange={onFotoChange}
              className={styles.peInputFile}
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Nombre</label>
            <input
              className={styles.peInput}
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Correo</label>
            <input
              className={styles.peInput}
              type="email"
              name="correo"
              value={formData.correo}
              disabled   // 👈 Solo lectura
              readOnly
            />
          </div>

          <div className={styles.peField}>
            <label className={styles.peLabel}>Teléfono</label>
            <input
              className={styles.peInput}
              type="text"
              name="telefono"
              value={formData.telefono || ""}
              onChange={onChange}
            />
          </div>

          {/* Sin campo Dirección, lo ignoramos */}

          <div className={styles.peActions}>
            <button type="button" className={styles.peBtnSuccess} onClick={guardar}>💾 Guardar</button>
            <button type="button" className={styles.peBtnDanger} onClick={() => setEditando(false)}>❌ Cancelar</button>
          </div>
        </section>
      )}
    </div>
  );
}
