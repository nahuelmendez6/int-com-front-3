// src/services/notificationSocket.service.js
// =====================================================
// Servicio de WebSocket para Notificaciones
// -----------------------------------------------------
// Este módulo centraliza la gestión de la conexión WebSocket para
// notificaciones en tiempo real. Asegura que solo exista una instancia
// del socket y que su ciclo de vida esté atado al de la sesión del usuario.
// =====================================================

let socket = null; // Instancia única del socket
let reconnectTimeout = null;

/**
 * Inicia la conexión WebSocket después del login.
 * @param {function} onMessageCallback - Función que se ejecuta al recibir un mensaje.
 */
export const connectNotificationSocket = (onMessageCallback) => {
  // 1. Evitar conexiones duplicadas
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.warn("WebSocket de notificaciones ya está conectado.");
    return;
  }

  // 2. Obtener el token de autenticación
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No se puede conectar al socket: token no encontrado.");
    return;
  }

  // 3. Crear la nueva instancia del WebSocket usando el token
  const wsUrl = `ws://127.0.0.1:8000/ws/notifications/?token=${token}`;
  socket = new WebSocket(wsUrl);

  // 4. Manejar eventos
  socket.onopen = () => {
    console.log("✅ Conexión de notificaciones establecida.");
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

  socket.onmessage = (event) => {
    onMessageCallback(event);
  };

  socket.onclose = (event) => {
    console.log(`🔌 Conexión de notificaciones cerrada (código: ${event.code}).`);
    socket = null; // Limpiar la instancia para permitir una nueva conexión futura.

    // Reconexión automática si el cierre no fue intencional (código 1000)
    if (event.code !== 1000) {
      console.log('🔄 Intentando reconectar WebSocket de notificaciones...');
      reconnectTimeout = setTimeout(() => connectNotificationSocket(onMessageCallback), 5000);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Error en WebSocket de notificaciones:", error);
    socket?.close();
  };
};

/**
 * Cierra la conexión WebSocket antes del logout.
 */
export const disconnectNotificationSocket = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (socket) {
    console.log("Cerrando conexión de notificaciones...");
    socket.close(1000, "Cierre de sesión del usuario"); // Código 1000 para cierre normal
    socket = null;
  }
};

/**
 * Envía un comando a través del WebSocket.
 * @param {object} command - El comando a enviar.
 */
export const sendNotificationCommand = (command) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(command));
  } else {
    console.warn("No se puede enviar el comando, el socket no está conectado.");
  }
};