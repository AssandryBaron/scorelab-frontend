import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const InscribirJugadores = ({ equipoId, alFinalizar }) => {
    const [jugadoresExistentes, setJugadoresExistentes] = useState([]);
    const [nuevosJugadores, setNuevosJugadores] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Función para cargar la plantilla desde el backend
    const cargarJugadores = useCallback(async () => {
        try {
            const res = await api.get(`/equipos/${equipoId}/jugadores`);
            setJugadoresExistentes(res.data.datos || []);
        } catch (err) {
            console.error("Error al cargar jugadores:", err);
        }
    }, [equipoId]);

    useEffect(() => {
        cargarJugadores();
    }, [cargarJugadores]);

    // Manejar cambios en los inputs de nuevos jugadores
    const handleNewInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...nuevosJugadores];
        list[index][name] = name === "numeroCamiseta" ? parseInt(value) || '' : value;
        setNuevosJugadores(list);
    };

    const agregarFila = () => {
        setNuevosJugadores([...nuevosJugadores, { nombre: '', documento: '', posicion: '', numeroCamiseta: '' }]);
    };

    const eliminarFilaNueva = (index) => {
        const list = [...nuevosJugadores];
        list.splice(index, 1);
        setNuevosJugadores(list);
    };

    // Función para enviar los datos al servidor
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nuevosJugadores.length === 0) return;

        setCargando(true);
        try {
            await api.post(`/equipos/${equipoId}/jugadores/lote`, nuevosJugadores);
            alert("¡Jugadores inscritos correctamente!");
            setNuevosJugadores([]); 
            cargarJugadores(); // Refresca la tabla de arriba
            if (alFinalizar) alFinalizar();
        } catch (err) {
            alert("Error al guardar: " + (err.response?.data?.mensaje || "Revisa duplicados"));
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <h3 style={{ color: '#58a6ff', margin: 0 }}>Plantilla Actual ({jugadoresExistentes.length})</h3>
                <button type="button" onClick={agregarFila} style={btnAddNewStyle}>
                    + Inscribir Nuevo Jugador
                </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Nombre</th>
                            <th style={thStyle}>Documento</th>
                            <th style={thStyle}>Posición</th>
                            <th style={thStyle}>Dorsal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jugadoresExistentes.map(j => (
                            <tr key={j.id} style={{ borderBottom: '1px solid #21262d' }}>
                                <td style={tdStyle}>{j.nombre}</td>
                                <td style={tdStyle}>{j.documento}</td>
                                <td style={tdStyle}>
                                    <span style={posicionBadgeStyle}>{j.posicion || 'N/A'}</span>
                                </td>
                                <td style={tdStyle}><strong style={{color: '#e3b341'}}>#{j.numeroCamiseta}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {nuevosJugadores.length > 0 && (
                <form onSubmit={handleSubmit} style={{ marginTop: '25px', borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Nombre</th>
                                <th style={thStyle}>Documento</th>
                                <th style={thStyle}>Posición</th>
                                <th style={thStyle}>Dorsal</th>
                                <th style={thStyle}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {nuevosJugadores.map((j, index) => (
                                <tr key={index}>
                                    <td style={tdStyle}><input name="nombre" placeholder="Nombre" onChange={e => handleNewInputChange(index, e)} style={inputStyle} required /></td>
                                    <td style={tdStyle}><input name="documento" placeholder="ID" onChange={e => handleNewInputChange(index, e)} style={inputStyle} required /></td>
                                    <td style={tdStyle}>
                                        <select name="posicion" onChange={e => handleNewInputChange(index, e)} style={inputStyle} required>
                                            <option value="">Elegir...</option>
                                            <option value="Portero">Portero</option>
                                            <option value="Defensa">Defensa</option>
                                            <option value="Mediocampista">Mediocampista</option>
                                            <option value="Delantero">Delantero</option>
                                        </select>
                                    </td>
                                    <td style={tdStyle}><input name="numeroCamiseta" type="number" placeholder="#" onChange={e => handleNewInputChange(index, e)} style={{ ...inputStyle, width: '60px' }} required /></td>
                                    <td style={tdStyle}><button type="button" onClick={() => eliminarFilaNueva(index)} style={{background:'none', border:'none', cursor:'pointer'}}>❌</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                        <button type="button" onClick={() => setNuevosJugadores([])} style={btnCancelSmall}>Cancelar</button>
                        <button type="submit" disabled={cargando} style={btnPrimary}>
                            {cargando ? 'Inscribiendo...' : '💾 Confirmar Registro'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

// --- ESTILOS ---
const cardStyle = { backgroundColor: '#161b22', padding: '25px', borderRadius: '12px', border: '1px solid #30363d' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const tableStyle = { width: '100%', color: 'white', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', color: '#8b949e', padding: '12px', borderBottom: '2px solid #30363d', fontSize: '13px' };
const tdStyle = { padding: '12px' };
const inputStyle = { backgroundColor: '#0d1117', color: 'white', border: '1px solid #30363d', padding: '8px', borderRadius: '6px', width: '90%' };
const btnPrimary = { backgroundColor: '#238636', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 'bold' };
const btnAddNewStyle = { backgroundColor: '#1f6feb', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 'bold' };
const btnCancelSmall = { backgroundColor: 'transparent', color: '#f85149', border: '1px solid #f85149', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' };
const posicionBadgeStyle = { backgroundColor: 'rgba(56, 139, 253, 0.1)', color: '#58a6ff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', border: '1px solid rgba(56, 139, 253, 0.3)', textTransform: 'uppercase', fontWeight: 'bold' };

export default InscribirJugadores;