import React, { useState, useEffect } from 'react';
import api from '../api/api';

const DashboardOrganizador = () => {
    // --- ESTADOS ---
    const [solicitudes, setSolicitudes] = useState([]);
    const [torneos, setTorneos] = useState([]); 
    const [cargando, setCargando] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [nuevoTorneo, setNuevoTorneo] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: ''
    });

    // --- CARGA DE DATOS ---
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            // Ejecutamos ambas peticiones para llenar el dashboard completo
            const [resSolicitudes, resTorneos] = await Promise.all([
                api.get('/equipos/pendientes'),
                api.get('/torneos/mis-torneos') 
            ]);

            // Accedemos a .datos porque el Backend usa el DTO ApiResponse
            setSolicitudes(resSolicitudes.data.datos || []);
            setTorneos(resTorneos.data.datos || []);
        } catch (err) {
            console.error("Error cargando dashboard:", err);
        } finally {
            setCargando(false);
        }
    };

    // --- FUNCIONES DE ACCIÓN ---
    const handleAprobar = async (id, nombreEquipo) => {
        if (!window.confirm(`¿Estás seguro de aprobar al equipo "${nombreEquipo}"?`)) return;
        try {
            await api.patch(`/equipos/${id}/aprobar`);
            alert("¡Equipo aprobado con éxito!");
            cargarDatos(); 
        } catch (err) {
            console.error(err);
            alert("No se pudo aprobar el equipo");
        }
    };

    const handleCrearTorneoSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/torneos', nuevoTorneo);
            alert("🏆 " + (res.data.mensaje || "Torneo creado"));
            setShowModal(false);
            setNuevoTorneo({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });
            cargarDatos(); 
        } catch (err) {
            console.error("Error:", err.response?.data);
            alert(err.response?.data?.mensaje || "Error al crear torneo");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={containerStyle}>
            {/* CABECERA */}
            <header style={headerContainerStyle}>
                <div>
                    <h1 style={{ margin: 0 }}>Dashboard Organizador 🏟️</h1>
                    <p style={{ color: '#8b949e', margin: '5px 0 0 0' }}>Panel de control y gestión</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowModal(true)} style={btnCrearTorneoStyle}>
                        + Crear Nuevo Torneo
                    </button>
                    <button onClick={handleLogout} style={btnLogoutStyle}>
                        Cerrar Sesión 🚪
                    </button>
                </div>
            </header>

            {/* SECCIÓN 1: TORNEOS REGISTRADOS (CARDS) */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>🏆 Torneos bajo tu gestión</h2>
                {torneos.length > 0 ? (
                    <div style={gridTorneosStyle}>
                        {torneos.map((torneo) => (
                            <div key={torneo.id} style={cardTorneoStyle}>
                                <h3 style={{ color: '#e3b341', marginTop: 0 }}>{torneo.nombre}</h3>
                                <p style={pCardStyle}><strong>Descripción:</strong> {torneo.descripcion || 'Sin descripción'}</p>
                                <hr style={{ border: '0.1px solid #30363d', margin: '15px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span>📅 <strong>Inicia:</strong> {torneo.fechaInicio}</span>
                                    <span>🏁 <strong>Fin:</strong> {torneo.fechaFin}</span>
                                </div>
                                <div style={badgeEquiposStyle}>
                                    {torneo.cantidadEquipos || 0} Equipos inscritos
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>Aún no has creado torneos.</div>
                )}
            </section>

            {/* SECCIÓN 2: SOLICITUDES (TABLA) */}
            <section style={sectionStyle}>
                <div style={titleRowStyle}>
                    <h2 style={{ margin: 0 }}>📩 Equipos Pendientes de Aprobación</h2>
                    <button onClick={cargarDatos} style={btnRefreshStyle}>🔄 Actualizar todo</button>
                </div>

                {cargando ? (
                    <p style={{ color: '#8b949e' }}>Cargando información...</p>
                ) : solicitudes.length > 0 ? (
                    <div style={tableWrapperStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Equipo</th>
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
                                            <button onClick={() => handleAprobar(sol.id, sol.nombre)} style={btnAprobarStyle}>
                                                ✅ Aprobar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={emptyStateStyle}>No hay solicitudes pendientes. ✨</div>
                )}
            </section>

            {/* MODAL DE CREACIÓN */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={{ marginTop: 0, color: '#e3b341' }}>🏆 Nuevo Torneo</h2>
                        <form onSubmit={handleCrearTorneoSubmit}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Nombre del Torneo</label>
                                <input type="text" style={inputStyle} value={nuevoTorneo.nombre} onChange={(e) => setNuevoTorneo({...nuevoTorneo, nombre: e.target.value})} required />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Descripción</label>
                                <textarea style={{...inputStyle, minHeight: '60px'}} value={nuevoTorneo.descripcion} onChange={(e) => setNuevoTorneo({...nuevoTorneo, descripcion: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{flex: 1}}><label style={labelStyle}>Inicio</label><input type="date" style={inputStyle} value={nuevoTorneo.fechaInicio} onChange={(e) => setNuevoTorneo({...nuevoTorneo, fechaInicio: e.target.value})} required /></div>
                                <div style={{flex: 1}}><label style={labelStyle}>Fin</label><input type="date" style={inputStyle} value={nuevoTorneo.fechaFin} onChange={(e) => setNuevoTorneo({...nuevoTorneo, fechaFin: e.target.value})} required /></div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                                <button type="submit" style={btnAprobarStyle}>Guardar</button>
                                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS ---
const gridTorneosStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
const cardTorneoStyle = { backgroundColor: '#161b22', padding: '25px', borderRadius: '12px', border: '1px solid #30363d', transition: 'transform 0.2s', cursor: 'default' };
const pCardStyle = { fontSize: '14px', color: '#8b949e', lineHeight: '1.4' };
const badgeEquiposStyle = { marginTop: '15px', display: 'inline-block', padding: '5px 12px', backgroundColor: 'rgba(35, 134, 54, 0.15)', color: '#3fb950', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(63, 185, 80, 0.3)' };

const containerStyle = { padding: '40px', color: 'white', minHeight: '100vh', backgroundColor: '#0d1117', fontFamily: 'sans-serif' };
const headerContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #30363d', paddingBottom: '20px' };
const sectionStyle = { backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', padding: '25px' };
const titleRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const tableWrapperStyle = { overflowX: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #30363d', color: '#8b949e', fontSize: '14px' };
const tdStyle = { padding: '15px 12px', borderBottom: '1px solid #30363d' };
const trStyle = { transition: 'background 0.2s' };
const btnCrearTorneoStyle = { backgroundColor: '#238636', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnAprobarStyle = { backgroundColor: '#238636', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnLogoutStyle = { backgroundColor: 'transparent', color: '#f85149', border: '1px solid #f85149', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' };
const btnRefreshStyle = { backgroundColor: 'transparent', color: '#58a6ff', border: '1px solid #58a6ff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' };
const btnCancelStyle = { backgroundColor: 'transparent', color: '#8b949e', border: '1px solid #30363d', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#161b22', padding: '30px', borderRadius: '12px', border: '1px solid #30363d', width: '450px' };
const inputGroupStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', color: '#8b949e' };
const inputStyle = { backgroundColor: '#0d1117', color: 'white', border: '1px solid #30363d', padding: '12px', borderRadius: '6px', outline: 'none' };
const emptyStateStyle = { textAlign: 'center', padding: '40px', color: '#484f58', border: '1px dashed #30363d', borderRadius: '12px' };

export default DashboardOrganizador;