// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 
      BrowserRouter permite manejar las rutas con react-router-dom 
      Todo lo que esté dentro de <BrowserRouter> podrá usar rutas
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  );


