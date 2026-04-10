import React, { useState, useEffect } from 'react';
import api from '../api/api';

const DashboardOrganizador = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Cargar solicitudes al entrar
    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        try {
            setCargando(true);
            const res = await api.get('/equipos/pendientes');
            setSolicitudes(res.data.datos || []);
        } catch (err) {
            console.error("Error cargando solicitudes:", err);
        } finally {
            setCargando(false);
        }
    };

    const handleAprobar = async (id, nombreEquipo) => {
        if (!window.confirm(`¿Estás seguro de aprobar al equipo "${nombreEquipo}"?`)) return;
        
        try {
            await api.patch(`/equipos/${id}/aprobar`);
            alert("¡Equipo aprobado con éxito!");
            cargarSolicitudes(); // Refrescar la tabla
        } catch (err) {
            console.error(err);
            alert("No se pudo aprobar el equipo");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={containerStyle}>
            {/* Cabecera con Botón de Salida */}
            <header style={headerContainerStyle}>
                <div>
                    <h1 style={{ margin: 0 }}>Dashboard Organizador 🏟️</h1>
                    <p style={{ color: '#8b949e', margin: '5px 0 0 0' }}>Gestión de torneos y solicitudes de inscripción</p>
                </div>
                <button onClick={handleLogout} style={btnLogoutStyle}>
                    Cerrar Sesión 🚪
                </button>
            </header>

            <section style={sectionStyle}>
                <div style={titleRowStyle}>
                    <h2 style={{ margin: 0 }}>Solicitudes Pendientes</h2>
                    <button onClick={cargarSolicitudes} style={btnRefreshStyle}>🔄 Actualizar lista</button>
                </div>

                {cargando ? (
                    <p style={{ color: '#8b949e' }}>Buscando solicitudes...</p>
                ) : solicitudes.length > 0 ? (
                    <div style={tableWrapperStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Nombre del Equipo</th>
                                    <th style={thStyle}>Delegado</th>
                                    <th style={thStyle}>Ciudad</th>
                                    <th style={thStyle}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudes.map((sol) => (
                                    <tr key={sol.id} style={trStyle}>
                                        <td style={tdStyle}><strong>{sol.nombre}</strong></td>
                                        <td style={tdStyle}>{sol.nombreDelegado}</td>
                                        <td style={tdStyle}>{sol.ciudad}</td>
                                        <td style={tdStyle}>
                                            <button 
                                                onClick={() => handleAprobar(sol.id, sol.nombre)}
                                                style={btnAprobarStyle}
                                            >
                                                ✅ Aprobar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <p>No hay equipos esperando aprobación por ahora. ✨</p>
                    </div>
                )}
            </section>
        </div>
    );
};

// --- ESTILOS CORREGIDOS (Sin duplicados) ---
const containerStyle = { 
    padding: '40px', 
    color: 'white', 
    minHeight: '100vh', 
    backgroundColor: '#0d1117', 
    fontFamily: 'sans-serif' 
};

const headerContainerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '40px', 
    borderBottom: '1px solid #30363d', 
    paddingBottom: '20px' 
};

const sectionStyle = { 
    backgroundColor: '#161b22', 
    borderRadius: '12px', 
    border: '1px solid #30363d', 
    padding: '25px' 
};

const titleRowStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px' 
};

const tableWrapperStyle = { overflowX: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const thStyle = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #30363d', color: '#8b949e', fontSize: '14px' };
const tdStyle = { padding: '15px 12px', borderBottom: '1px solid #30363d', fontSize: '15px' };
const trStyle = { transition: 'background 0.2s' };

const btnAprobarStyle = { 
    backgroundColor: '#238636', color: 'white', border: 'none', padding: '8px 16px', 
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' 
};

const btnRefreshStyle = {
    backgroundColor: 'transparent', color: '#58a6ff', border: '1px solid #58a6ff',
    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
};

const btnLogoutStyle = {
    backgroundColor: 'transparent',
    color: '#f85149',
    border: '1px solid #f85149',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const emptyStateStyle = { 
    textAlign: 'center', 
    padding: '40px', 
    color: '#484f58', 
    border: '2px dashed #30363d', 
    borderRadius: '12px' 
};

export default DashboardOrganizador;