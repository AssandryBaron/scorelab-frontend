import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; 
import "./Login.css"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); 

    try {
      const response = await api.post("/auth/login", { correo, contrasena });

      // Imprimimos para estar 100% seguros
      console.log("Datos recibidos:", response.data);

      // 1. En tu Java, el token viene en la propiedad 'datos'
      const token = response.data.datos; 
      
      // 2. Si el rol no viene en la respuesta, lo ideal sería que tu Java lo incluya.
      // Por ahora, para que no falle, lo buscaremos en 'rol' o pondremos uno por defecto
      const rol = response.data.rol || "ORGANIZADOR"; 

      if (token) {
        // Guardamos en el navegador
        localStorage.setItem("token", token);
        localStorage.setItem("rol", rol);

        alert("¡Inicio de sesión exitoso! Bienvenido a ScoreLab");

        // 3. Redirección
        if (rol === "ORGANIZADOR") {
          navigate("/dashboard-organizador");
        } else {
          navigate("/dashboard-delegado");
        }
      } else {
        setError("El servidor no devolvió el token en la propiedad 'datos'");
      }
      
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Credenciales incorrectas o problema de conexión.");
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