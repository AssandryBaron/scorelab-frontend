import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; 
import "./Login.css"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  /*const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); 

    try {
      const response = await api.post("/auth/login", { correo, contrasena });

      // LOG PARA DEBUG: Aquí verás el objeto ApiResponse { exito, mensaje, datos }
      console.log("Respuesta completa del servidor:", response.data);

      // 1. Extraemos el objeto AuthResponse que está dentro de 'datos'
      const authData = response.data.datos; 

      if (authData && authData.token) {
        // 2. Guardamos la información real que viene del Backend
        localStorage.setItem("token", authData.token);
        localStorage.setItem("rol", authData.rol); // Viene DELEGADO u ORGANIZADOR
        localStorage.setItem("nombre", authData.nombre);

        // 3. Redirección basada en el ROL REAL
        if (authData.rol === "ORGANIZADOR") {
          navigate("/dashboard-organizador");
        } else if (authData.rol === "DELEGADO") {
          navigate("/dashboard-delegado");
        } else {
          // Por si acaso tienes otros roles en el futuro
          navigate("/");
        }
      } else {
        setError("Error en el formato de respuesta del servidor.");
      }
      
    } catch (err) {
      console.error("Error en el login:", err);
      // Si el backend envía un mensaje de error en ApiResponse, lo mostramos
      const mensajeError = err.response?.data?.mensaje || "Credenciales incorrectas o problema de conexión.";
      setError(mensajeError);
    }
  };*/

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); 

    try {
      const response = await api.post("/auth/login", { correo, contrasena });
      
      // 🕵️ EXTRAEMOS LOS DATOS
      const authData = response.data.datos; 
      
      // 🚨 DEBUG: Esto te dirá exactamente qué está leyendo React
      console.log("¿Qué rol recibí del servidor?", authData.rol);

      if (authData && authData.token) {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("rol", authData.rol);
        
        // PAUSA DE SEGURIDAD: Solo para ver qué dice el mensaje
        alert("Rol detectado: " + authData.rol);

        if (authData.rol === "DELEGADO") {
            console.log("Redirigiendo a DELEGADO...");
            navigate("/dashboard-delegado");
        } else {
            console.log("Redirigiendo a ORGANIZADOR...");
            navigate("/dashboard-organizador");
        }
      }
    } catch (err) {
      console.error("Error completo:", err);
      setError("Fallo en el login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand">
          <div className="logo-icon">⚽</div>
          <h1>SCORELAB</h1>
          <p>Gestión de torneos de fútbol</p>
        </div>

        <form onSubmit={handleLogin}>
          <h2>Iniciar sesión</h2>
          <p className="subtitle">Ingresa con tu cuenta registrada</p>

          {error && (
            <p style={{ 
              backgroundColor: "rgba(255, 0, 0, 0.1)", 
              color: "#ff4d4d", 
              padding: "10px", 
              borderRadius: "5px", 
              fontSize: "13px",
              border: "1px solid #ff4d4d",
              marginBottom: "15px"
            }}>
              {error}
            </p>
          )}

          <div className="input-group">
            <label>CORREO ELECTRÓNICO</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>CONTRASEÑA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <span className="forgot-password" style={{ cursor: 'pointer', color: '#8b949e', fontSize: '12px', display: 'block', textAlign: 'right', marginBottom: '15px' }}>
            ¿Olvidaste tu contraseña?
          </span>

          <button type="submit" className="btn-submit">
            Ingresar ➔
          </button>

          <p className="register-text">
            ¿No tienes cuenta?{" "}
            <span
              className="register-link"
              style={{ color: "#00ff66", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/register")}
            >
              Crear cuenta nueva ➔
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;