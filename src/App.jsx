// Importa el componente BrowserRouter de React Router DOM.
// Este componente permite manejar la navegación del lado del cliente (sin recargar la página)
// utilizando la API de historial del navegador.

import { BrowserRouter } from 'react-router-dom';

// Importa el componente que define todas las rutas de la aplicación.
import AppRoutes from './routes/AppRoutes';

// Importa los estilos base de Bootstrap para aplicar diseño responsivo y estilos predefinidos.
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa los íconos de Bootstrap (opcional, útil para botones, menús, etc.).
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importa los íconos de Font Awesome para disponer de una librería más amplia de íconos vectoriales.
import '@fortawesome/fontawesome-free/css/all.min.css';


// Importa el contexto de autenticación, que gestiona el estado del usuario (login, logout, roles, etc.)
import { AuthProvider } from './contexts/AuthContext';

// Importa el contexto de notificaciones, que se encarga de mostrar y administrar notificaciones globales.
import { NotificationProvider } from './contexts/NotificationContext.jsx';

// Importa el contexto de mensajes, que gestiona la comunicación interna o mensajes entre usuarios/componentes.
import { MessageProvider } from './contexts/MessageContext.jsx';

// Importa el componente que se encarga de mostrar las notificaciones visuales (toasts, alertas, etc.)
import NotificationManager from './components/NotificationManager';


// Importa los estilos personalizados de la aplicación.
import './App.css'

// Define el componente principal de la aplicación.
function App() {
  return (
    // BrowserRouter envuelve toda la aplicación para habilitar la navegación por rutas.
    <BrowserRouter>
        {/* AuthProvider provee el contexto de autenticación a toda la aplicación. 
        Todos los componentes dentro de él pueden acceder al usuario autenticado y sus datos. */}
      <AuthProvider>
         {/* NotificationProvider provee un contexto global para gestionar notificaciones. */}
        <NotificationProvider>
          {/* MessageProvider gestiona el contexto para el envío y recepción de mensajes. */}
          <MessageProvider>
            {/* NotificationManager se encarga de renderizar las notificaciones visuales. */}
            <NotificationManager />
            {/* AppRoutes define las rutas y los componentes que se renderizan en cada URL. */}
            <AppRoutes />
          </MessageProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
// Exporta el componente principal para que pueda ser usado en index.jsx.
export default App
