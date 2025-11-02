// Importa StrictMode desde React. 
// StrictMode ayuda a identificar posibles problemas en el código durante el desarrollo,
// como ciclos de vida obsoletos o efectos secundarios no seguros.

import { StrictMode } from 'react'


// Importa la función createRoot de ReactDOM para crear el punto de entrada de la aplicación React.
import { createRoot } from 'react-dom/client'
// import './index.css'


// Importa el bundle JS de Bootstrap (opcional).
// Este archivo incluye scripts necesarios para componentes interactivos como modales, dropdowns, tooltips, etc.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // opcional, solo si usas componentes JS como modal, dropdown



// Importa el contenedor de notificaciones de la librería react-toastify,
// que permite mostrar alertas visuales (toasts) en pantalla.
import { ToastContainer } from 'react-toastify';

// Importa los estilos CSS de react-toastify para los toasts.
import 'react-toastify/dist/ReactToastify.css';

// Importa el componente principal de la aplicación (punto de entrada lógico).
import App from './App.jsx'


// Crea el “root” de React y renderiza la aplicación dentro del elemento con id "root" en el HTML.
// Este es el punto donde React toma control del DOM.
createRoot(document.getElementById('root')).render(
   // StrictMode envuelve la aplicación para activar verificaciones adicionales durante el desarrollo.
  <StrictMode>
    <>
     {/* Renderiza el componente principal de la aplicación */}
      <App />

       {/* Contenedor global de notificaciones (toasts). 
          Permite mostrar mensajes emergentes desde cualquier parte de la app.
          Las props definen el comportamiento de los toasts (posición, duración, interacciones, etc.) */}
      <ToastContainer
        position="bottom-right"   // Ubicación del toast en la esquina inferior derecha
        autoClose={5000}          // Cierra automáticamente después de 5 segundos
        hideProgressBar={false}   // Muestra la barra de progreso
        newestOnTop={false}        // Los toasts nuevos no reemplazan a los anteriores
        closeOnClick              // Permite cerrar al hacer clic
        rtl={false}               // Desactiva el modo de texto de derecha a izquierda
        pauseOnFocusLoss          // Pausa el temporizador si la ventana pierde el foco

        draggable                 // Permite arrastrar los toasts
        pauseOnHover               // Pausa el cierre mientras el cursor está sobre el toast
      />
    </>
  </StrictMode>,
)
