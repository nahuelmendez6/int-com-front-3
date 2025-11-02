// Importa React y herramientas del contexto:
// - createContext: para crear un contexto global.
// - useContext: para consumir dicho contexto desde otros componentes.

import React, { createContext, useContext } from 'react';

// Importa un *custom hook* (gancho personalizado) que contiene la lógica de manejo de mensajes.
// Este hook centraliza toda la funcionalidad de envío, recepción o manejo de mensajes.
import { useMessages } from '../hooks/useMessages';


// Crea el contexto para el sistema de mensajes.
// Se inicializa con valor `null` hasta que el proveedor lo defina.
const MessageContext = createContext(null);



// Componente proveedor del contexto de mensajes.
// Este componente envuelve la aplicación (o parte de ella) para permitir
// el acceso al sistema de mensajes desde cualquier componente hijo.
export const MessageProvider = ({ children }) => {
    // Ejecuta el hook personalizado `useMessages`, que devuelve
  // las funciones y estados necesarios para gestionar los mensajes.
  const messageManager = useMessages();
    // Proporciona el valor del contexto (messageManager) a todos los componentes hijos.
  // De esta forma, cualquier componente dentro del árbol puede usar el contexto.
  return (
    <MessageContext.Provider value={messageManager}>
      {children}
    </MessageContext.Provider>
  );
};


// Hook auxiliar para acceder fácilmente al contexto de mensajes.
// Se usa en lugar de `useContext(MessageContext)` directamente,
// y además valida que se use dentro del proveedor correspondiente.
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  // Si el hook se usa fuera del <MessageProvider>, lanza un error descriptivo.
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  // Retorna el objeto que contiene las funciones y estados del sistema de mensajes.
  return context;
};
