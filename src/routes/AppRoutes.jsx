import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta por defecto redirige al feed */}
      <Route path="/" element={<Navigate to="/feed" replace />} />
      
      {/* Rutas de autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Ruta principal del feed */}
      <Route path="/feed" element={<Feed />} />
      
      {/* Ruta de perfil */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<div className="min-vh-100 d-flex align-items-center justify-content-center"><h1>Mensajes (Próximamente)</h1></div>} />
      <Route path="/settings" element={<div className="min-vh-100 d-flex align-items-center justify-content-center"><h1>Configuración (Próximamente)</h1></div>} />
      <Route path="/logout" element={<div className="min-vh-100 d-flex align-items-center justify-content-center"><h1>Logout (Próximamente)</h1></div>} />
      
      {/* Ruta 404 */}
      <Route path="*" element={<div className="min-vh-100 d-flex align-items-center justify-content-center"><h1>Página no encontrada</h1></div>} />
    </Routes>
  );
};

export default AppRoutes;
