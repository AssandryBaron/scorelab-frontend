import React, { useState, useEffect } from 'react';
import api from '../api/api';

const GestionarTorneos = () => {
    // 1. Estados
    const [torneos, setTorneos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoTorneo, setNuevoTorneo] = useState({ 
        nombre: '', 
        descripcion: '', 
        fechaInicio: '', 
        fechaFin: '' 
    });

    // 2. Declaración de función con Hoisting (Evita error de acceso previo)
    // El prefijo /api es necesario por tu TorneoController en Spring Boot
    async function fetchTorneos() {
        try {
            setCargando(true);
            const res = await api.get('/torneos/mis-torneos');
            // Accedemos a .data.data debido a tu clase ApiResponse
            setTorneos(res.data.datos || []); 
        } catch (err) {
            console.error("Error cargando torneos:", err);
        } finally {
            setCargando(false);
        }
    }

    // 3. Efecto de carga inicial
    useEffect(() => {
        fetchTorneos();
    }, []);

    // 4. Manejo del formulario para crear torneos
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // El path coincide con el @PostMapping de tu TorneoController
            await api.post('/torneos', nuevoTorneo);
            setMostrarForm(false);
            await fetchTorneos(); // Recarga la lista actualizada
            alert("¡Torneo creado con éxito!");
            setNuevoTorneo({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });
        } catch (err) {
            console.error("Error al crear torneo:", err);
            alert("Error al crear el torneo. Revisa la consola.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <h2 style={{ color: '#00ff88', margin: 0, fontSize: '1.8rem' }}>Gestión de Torneos</h2>
                <button 
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{ 
                        background: mostrarForm ? '#ff4444' : '#00ff88', 
                        color: 'black', 
                        padding: '12px 24px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        border: 'none',
                        transition: '0.3s'
                    }}
                >
                    {mostrarForm ? '⬅️ Cancelar' : '+ Nuevo Torneo'}
                </button>
            </div>

            {mostrarForm ? (
                /* Formulario de Creación */
                <form onSubmit={handleSubmit} style={{ 
                    background: '#1a1a1a', 
                    padding: '30px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '15px',
                    border: '1px solid #333',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <h3 style={{ color: 'white', marginTop: 0 }}>Crear Nuevo Torneo</h3>
                    <input 
                        type="text" placeholder="Nombre del Torneo" value={nuevoTorneo.nombre}
                        onChange={e => setNuevoTorneo({...nuevoTorneo, nombre: e.target.value})} 
                        required style={inputStyle}
                    />
                    <textarea 
                        placeholder="Descripción del evento" value={nuevoTorneo.descripcion}
                        onChange={e => setNuevoTorneo({...nuevoTorneo, descripcion: e.target.value})} 
                        style={{ ...inputStyle, minHeight: '100px' }}
                    />
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Fecha Inicio</label>
                            <input 
                                type="date" value={nuevoTorneo.fechaInicio}
                                onChange={e => setNuevoTorneo({...nuevoTorneo, fechaInicio: e.target.value})} 
                                required style={inputStyle}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Fecha Fin</label>
                            <input 
                                type="date" value={nuevoTorneo.fechaFin}
                                onChange={e => setNuevoTorneo({...nuevoTorneo, fechaFin: e.target.value})} 
                                required style={inputStyle}
                            />
                        </div>
                    </div>
                    <button type="submit" style={{ 
                        background: '#00ff88', 
                        padding: '15px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer', 
                        border: 'none', 
                        borderRadius: '8px',
                        marginTop: '10px'
                    }}>
                        Guardar Torneo
                    </button>
                </form>
            ) : (
                /* Lista de Torneos */
                <>
                    {cargando ? (
                        <p style={{ color: '#00ff88' }}>Cargando tus torneos...</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {torneos.map(t => (
                                <div key={t.id} style={{ 
                                    background: '#1a1a1a', 
                                    padding: '20px', 
                                    borderRadius: '12px', 
                                    borderLeft: '6px solid #00ff88',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{t.nombre}</h3>
                                    <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>{t.descripcion}</p>
                                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ 
                                            background: '#004422', 
                                            color: '#00ff88', 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {t.estado || 'ACTIVO'}
                                        </span>
                                        <small style={{ color: '#666' }}>{t.fechaInicio}</small>
                                    </div>
                                </div>
                            ))}
                            {torneos.length === 0 && (
                                <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#666' }}>
                                    <p>No tienes torneos registrados todavía.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Estilos rápidos
const inputStyle = {
    padding: '12px',
    borderRadius: '6px',
    background: '#222',
    color: 'white',
    border: '1px solid #444',
    fontSize: '1rem'
};

const labelStyle = {
    color: '#aaa',
    fontSize: '12px',
    marginBottom: '5px',
    display: 'block'
};

export default GestionarTorneos;