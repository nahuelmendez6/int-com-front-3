// Importa React y las funciones necesarias para manejar contextos globales:
// - createContext: crea un contexto compartido entre componentes.
// - useContext: permite acceder a dicho contexto desde cualquier parte de la app.

import React, { createContext, useContext } from 'react';


// Importa un hook personalizado que encapsula toda la lógica de gestión de notificaciones.
// Este hook maneja la creación, visualización y eliminación de notificaciones.
import { useNotifications } from '../hooks/useNotifications';

// Crea el contexto de notificaciones, inicializándolo con `null`.
// Este contexto almacenará las funciones y estados relacionados con las notificaciones.
const NotificationContext = createContext(null);

// Componente proveedor del contexto de notificaciones.
// Su función es envolver partes de la aplicación que necesiten usar el sistema de notificaciones.
export const NotificationProvider = ({ children }) => {

  // Ejecuta el hook personalizado `useNotifications`, que devuelve un objeto
  // con funciones y estados para manejar las notificaciones (mostrar, cerrar, limpiar, etc.).
  const notificationManager = useNotifications();


  // Proporciona el valor del contexto (notificationManager) a todos los componentes hijos.
  // Así, cualquier componente dentro del árbol puede usar las funciones del hook sin tener que importarlo directamente.  
  return (
    <NotificationContext.Provider value={notificationManager}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook auxiliar para acceder fácilmente al contexto de notificaciones.
// Este hook simplifica el uso del contexto e incluye validación de uso correcto.
export const useNotificationContext = () => {
  // Obtiene el contexto actual.
  const context = useContext(NotificationContext);
  
  // Si el hook se usa fuera del <NotificationProvider>, lanza un error claro para el desarrollador.
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }

  // Retorna el objeto que contiene toda la lógica del sistema de notificaciones.
  return context;
};
