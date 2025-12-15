// src/config/api.js

const IS_LOCAL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const API_BASE = IS_LOCAL
  ? "http://localhost/barberia_app/php"
  : "https://barberia-render.onrender.com/barberia_app/php";
