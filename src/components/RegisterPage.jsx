import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  // Estado inicial con un rol válido de tu Enum
  const [rol, setRol] = useState('ORGANIZADOR');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Enviamos los datos al endpoint de Java
      const response = await api.post('/auth/register', {
        nombre: nombre,
        correo: correo,
        contrasena: contrasena,
        rol: rol 
      });

      console.log('Respuesta de Java:', response.data);
      alert('¡Cuenta creada con éxito en la base de datos!');
      navigate('/login');
      
    } catch (err) {
      console.error('Error detallado:', err.response?.data || err.message);
      alert('Hubo un error al registrar. Revisa la consola de IntelliJ.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      width: '100vw',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#161b22',
        padding: '40px',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '1px solid #30363d',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '30px' }}>⚽</div>
          <h1 style={{ color: '#00ff66', fontSize: '32px', margin: '5px 0', letterSpacing: '2px' }}>SCORELAB</h1>
          <p style={{ color: '#8b949e', fontSize: '14px', margin: '0' }}>Gestión de torneos de fútbol</p>
        </div>

        <form onSubmit={handleRegister}>
          <h2 style={{ color: '#ffffff', fontSize: '22px', marginBottom: '5px' }}>Crear cuenta nueva</h2>
          <p style={{ color: '#8b949e', fontSize: '14px', marginBottom: '20px' }}>Regístrate para empezar</p>

          {/* --- CAMPO DE ROL AHORA DE PRIMERO --- */}
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#8b949e', marginBottom: '5px', fontWeight: 'bold' }}>
              QUIERO REGISTRARME COMO
            </label>
            <select 
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#0d1117', 
                border: '1px solid #30363d', 
                borderRadius: '6px', 
                color: '#ffffff', 
                boxSizing: 'border-box',
                cursor: 'pointer',
                outline: 'none',
                fontSize: '14px'
              }}
            >
              <option value="ORGANIZADOR">Organizador de Torneos</option>
              <option value="DELEGADO">Delegado de Equipo</option>
            </select>
          </div>

          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#8b949e', marginBottom: '5px', fontWeight: 'bold' }}>NOMBRE COMPLETO</label>
            <input 
              type="text" 
              placeholder="Tu nombre" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#8b949e', marginBottom: '5px', fontWeight: 'bold' }}>CORREO ELECTRÓNICO</label>
            <input 
              type="email" 
              placeholder="tu@correo.com" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#8b949e', marginBottom: '5px', fontWeight: 'bold' }}>CONTRASEÑA</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#8b949e', marginBottom: '5px', fontWeight: 'bold' }}>CONFIRMAR CONTRASEÑA</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required 
            />
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: 'transparent', 
            color: '#ffffff', 
            border: '1px solid #00ff66', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            transition: '0.3s'
          }}>
            Registrarse ➔
          </button>

          <p style={{ marginTop: '20px', fontSize: '13px', color: '#8b949e' }}>
            ¿Ya tienes cuenta? <span style={{ color: '#00ff66', cursor: 'pointer' }} onClick={() => navigate('/login')}>Inicia sesión aquí ➔</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;