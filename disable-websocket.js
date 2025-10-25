// Script para deshabilitar WebSocket temporalmente durante el desarrollo
// Ejecutar en la consola del navegador:

// Deshabilitar WebSocket
localStorage.setItem('disableWebSocket', 'true');
console.log('🔔 WebSocket disabled for development');

// Para habilitar nuevamente cuando el backend esté listo:
// localStorage.removeItem('disableWebSocket');
// console.log('🔔 WebSocket enabled');
