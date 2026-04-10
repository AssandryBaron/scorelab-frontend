import React, { useState, useEffect } from 'react';
import api from '../api/api';
import InscribirJugadores from './InscribirJugadores'; // 👈 Asegúrate de que el nombre del archivo coincida

const DashboardDelegado = () => {
    // --- ESTADOS ---
    const [torneos, setTorneos] = useState([]);
    const [misEquipos, setMisEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', torneoId: '' });
    
    // 🌟 NUEVOS ESTADOS PARA JUGADORES
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
    const [vistaJugadores, setVistaJugadores] = useState(false);

    // --- EFECTOS ---
    useEffect(() => {
        cargarDatos();
    }, []);

    // --- FUNCIONES DE CARGA ---
    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [resTorneos, resEquipos] = await Promise.all([
                api.get('/torneos/todos'),
                api.get('/equipos/mis-equipos')
            ]);
            
            setTorneos(resTorneos.data.datos || []);
            setMisEquipos(resEquipos.data.datos || []);
        } catch (err) {
            console.error("Error al sincronizar datos:", err);
        } finally {
            setCargando(false);
        }
    };

    // --- ACCIONES ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/equipos', nuevoEquipo);
            alert("¡Solicitud enviada! El organizador debe aprobar tu equipo.");
            setMostrarForm(false);
            setNuevoEquipo({ nombre: '', torneoId: '' });
            cargarDatos();
        } catch (err) {
            console.error(err);
            alert("Error al registrar el equipo. Verifica los datos.");
        }
    };

    const handleGestionarJugadores = (equipo) => {
        setEquipoSeleccionado(equipo);
        setVistaJugadores(true);
    };

    const volverAlDashboard = () => {
        setVistaJugadores(false);
        setEquipoSeleccionado(null);
        cargarDatos(); // Recargamos por si hubo cambios
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // 🌟 RENDERIZADO CONDICIONAL DE LA VISTA DE JUGADORES
    if (vistaJugadores && equipoSeleccionado) {
        return (
            <div style={containerStyle}>
                <header style={headerContainerStyle}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Gestionar: {equipoSeleccionado.nombre} ⚽</h1>
                        <p style={{ color: '#8b949e' }}>Inscripción de plantilla oficial</p>
                    </div>
                    <button onClick={volverAlDashboard} style={btnCancelStyle}>
                        ⬅️ Volver al Panel
                    </button>
                </header>
                
                <InscribirJugadores 
                    equipoId={equipoSeleccionado.id} 
                    alFinalizar={volverAlDashboard} 
                />
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* Cabecera */}
            <header style={headerContainerStyle}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Dashboard Delegado 📋</h1>
                    <p style={{ color: '#8b949e', margin: '5px 0 0 0' }}>Gestiona tus equipos e inscripciones</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setMostrarForm(!mostrarForm)}
                        style={mostrarForm ? btnCancelStyle : btnSuccessStyle}
                    >
                        {mostrarForm ? 'Cancelar' : '+ Registrar mi Equipo'}
                    </button>
                    <button onClick={handleLogout} style={btnLogoutStyle}>
                        Cerrar Sesión 🚪
                    </button>
                </div>
            </header>

            {/* Formulario de Registro */}
            {mostrarForm ? (
                <div style={formCardStyle}>
                    <h3 style={{ marginTop: 0, color: '#58a6ff' }}>Inscribir nuevo equipo</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>NOMBRE DEL EQUIPO</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Deportivo Tapitas"
                                style={inputStyle}
                                value={nuevoEquipo.nombre}
                                onChange={e => setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})}
                                required
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>SELECCIONAR TORNEO</label>
                            <select 
                                style={inputStyle}
                                value={nuevoEquipo.torneoId}
                                onChange={e => setNuevoEquipo({...nuevoEquipo, torneoId: e.target.value})}
                                required
                            >
                                <option value="">-- Selecciona un torneo disponible --</option>
                                {torneos.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={btnSubmitStyle}>Enviar Solicitud ➔</button>
                    </form>
                </div>
            ) : (
                /* Listado de Equipos */
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Mis Equipos Registrados</h2>
                        <button onClick={cargarDatos} style={btnRefreshStyle}>🔄 Actualizar</button>
                    </div>
                    
                    {cargando ? (
                        <p style={{ color: '#8b949e' }}>Actualizando lista...</p>
                    ) : (
                        <div style={gridStyle}>
                            {misEquipos.length > 0 ? misEquipos.map(eq => (
                                <div key={eq.id} style={cardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <h3 style={{ margin: 0, color: '#f0f6fc' }}>{eq.nombre}</h3>
                                        <span style={badgeStyle(eq.estado)}>
                                            {eq.estado || 'PENDIENTE'}
                                        </span>
                                    </div>
                                    
                                    <p style={torneoTextStyle}>
                                        🏆 Torneo: <span style={{ color: '#c9d1d9' }}>{eq.nombreTorneo || "Sin asignar"}</span>
                                    </p>
                                    
                                    <hr style={dividerStyle} />
                                    
                                    <button 
                                        disabled={eq.estado !== 'APROBADO'} 
                                        style={btnJugadorStyle(eq.estado === 'APROBADO')}
                                        onClick={() => handleGestionarJugadores(eq)}
                                    >
                                        {eq.estado === 'APROBADO' ? '👥 Gestionar Jugadores' : '🔒 Bloqueado hasta aprobación'}
                                    </button>
                                </div>
                            )) : (
                                <div style={emptyStateStyle}>
                                    <p>Aún no tienes equipos. ¡Registra el primero arriba! ✨</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- OBJETOS DE ESTILO (Se mantienen igual) ---
const containerStyle = { padding: '40px', color: 'white', minHeight: '100vh', backgroundColor: '#0d1117', fontFamily: 'sans-serif' };
const headerContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #30363d', paddingBottom: '20px' };
const sectionTitleStyle = { color: '#8b949e', fontSize: '1.2rem', fontWeight: '400', margin: 0 };
const btnSuccessStyle = { backgroundColor: '#238636', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const btnCancelStyle = { backgroundColor: '#da3633', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const btnLogoutStyle = { backgroundColor: 'transparent', color: '#f85149', border: '1px solid #f85149', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const btnRefreshStyle = { backgroundColor: 'transparent', color: '#58a6ff', border: 'none', cursor: 'pointer', fontSize: '14px' };
const formCardStyle = { backgroundColor: '#161b22', padding: '30px', borderRadius: '10px', border: '1px solid #30363d', maxWidth: '500px', margin: '0 auto' };
const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '8px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white', boxSizing: 'border-box' };
const btnSubmitStyle = { width: '100%', padding: '12px', backgroundColor: '#2f81f7', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: '#161b22', padding: '20px', borderRadius: '10px', border: '1px solid #30363d', display: 'flex', flexDirection: 'column' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' };
const torneoTextStyle = { fontSize: '0.9rem', color: '#8b949e', margin: '5px 0' };
const dividerStyle = { borderColor: '#30363d', margin: '15px 0', borderStyle: 'solid', borderWidth: '0.5px' };
const emptyStateStyle = { gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#484f58', border: '2px dashed #30363d', borderRadius: '12px' };

const badgeStyle = (estado) => ({
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: estado === 'APROBADO' ? 'rgba(35, 134, 54, 0.2)' : 'rgba(187, 128, 9, 0.2)',
    color: estado === 'APROBADO' ? '#3fb950' : '#e3b341',
    border: `1px solid ${estado === 'APROBADO' ? '#238636' : '#9e6a03'}`,
    textTransform: 'uppercase'
});

const btnJugadorStyle = (active) => ({
    width: '100%',
    padding: '10px',
    border: '1px solid',
    borderColor: active ? '#58a6ff' : '#30363d',
    backgroundColor: active ? 'transparent' : 'rgba(48, 54, 61, 0.2)',
    color: active ? '#58a6ff' : '#484f58',
    borderRadius: '6px',
    cursor: active ? 'pointer' : 'not-allowed',
    fontWeight: '600',
    transition: '0.2s'
});

export default DashboardDelegado;