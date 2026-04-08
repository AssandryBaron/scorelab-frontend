import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardOrganizador from './components/DashboardOrganizador';
import DashboardDelegado from './components/DashboardDelegado';

/**
 * 🔒 Componente para Proteger Rutas
 * Si no hay un token en el localStorage, mandamos al usuario de vuelta al Login.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 REDIRECCIÓN INICIAL
            Si el usuario entra a http://localhost:3000/, lo enviamos automáticamente al Login.
        */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 🔓 RUTAS PÚBLICAS
            Cualquier persona puede acceder al Login y al Registro.
        */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 🔒 RUTAS PRIVADAS (DASHBOARDS)
            Solo accesibles si el usuario se ha logueado con éxito.
            Usamos 'PrivateRoute' para envolver estos componentes.
        */}
        <Route 
          path="/dashboard-organizador" 
          element={
            <PrivateRoute>
              <DashboardOrganizador />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/dashboard-delegado" 
          element={
            <PrivateRoute>
              <DashboardDelegado />
            </PrivateRoute>
          } 
        />

        {/* 🛣️ RUTA DE ERROR (OPCIONAL)
            Si escriben cualquier otra cosa en la URL, los mandamos al Login.
        */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;