# Sistema de Notificaciones en Tiempo Real

## Descripción

Este sistema implementa notificaciones en tiempo real usando WebSockets y API REST para la aplicación de Integración Comunitaria. Las notificaciones se muestran en el sidebar junto al perfil del usuario.

## Características Implementadas

### ✅ Componentes Principales

1. **NotificationIcon** - Icono de campana con contador de notificaciones no leídas
2. **NotificationPanel** - Panel desplegable que muestra todas las notificaciones
3. **NotificationManager** - Componente que gestiona la conexión WebSocket
4. **useNotifications** - Hook personalizado para gestión de estado
5. **notificationsService** - Servicio para comunicación con la API REST

### ✅ Funcionalidades

- **Notificaciones en tiempo real** via WebSocket
- **API REST** para gestión de notificaciones
- **Contador de notificaciones no leídas** en el icono
- **Panel desplegable** con lista de notificaciones
- **Marcar como leída** individual y masiva
- **Reconexión automática** del WebSocket
- **Toasts informativos** para nuevas notificaciones
- **Diseño responsive** para móviles y desktop

## Estructura de Archivos

```
src/
├── components/
│   ├── notifications/
│   │   ├── NotificationIcon.jsx      # Icono de notificaciones
│   │   ├── NotificationPanel.jsx    # Panel de notificaciones
│   │   └── Notifications.css         # Estilos CSS
│   └── NotificationManager.jsx      # Gestor de WebSocket
├── contexts/
│   └── NotificationContext.jsx      # Contexto de notificaciones
├── hooks/
│   └── useNotifications.js         # Hook personalizado
└── services/
    └── notifications.service.js     # Servicio API REST
```

## Tipos de Notificaciones Soportados

1. **postulation_created** - Nueva postulación recibida
2. **postulation_accepted** - Postulación aceptada
3. **postulation_rejected** - Postulación rechazada
4. **postulation_state_changed** - Estado de postulación cambiado
5. **petition_closed** - Petición cerrada

## Configuración del Backend

### Endpoints Requeridos

```javascript
// API REST
GET    /notifications/              # Obtener notificaciones
GET    /notifications/stats/        # Estadísticas
POST   /notifications/{id}/mark-read/ # Marcar como leída
POST   /notifications/mark-all-read/ # Marcar todas como leídas
GET    /notifications/settings/     # Configuración del usuario
PUT    /notifications/settings/     # Actualizar configuración

// WebSocket
ws://127.0.0.1:8000/ws/notifications/{user_id}/
```

### Formato de Respuesta API

```json
{
  "id": 1,
  "title": "Nueva postulación recibida",
  "message": "Tu petición 'Reparación de techo' recibió una nueva postulación.",
  "notification_type": "postulation_created",
  "is_read": false,
  "created_at": "2024-01-15T10:30:00Z",
  "time_ago": "2 horas atrás",
  "metadata": {
    "postulation_id": 123,
    "petition_id": 456,
    "provider_id": 789
  }
}
```

### Formato WebSocket

```json
// Conexión establecida
{
  "type": "connection_established",
  "unread_count": 3
}

// Nueva notificación
{
  "type": "notification_created",
  "notification": { ... },
  "unread_count": 4
}

// Notificación actualizada
{
  "type": "notification_updated",
  "notification": { ... },
  "unread_count": 3
}

// Notificación eliminada
{
  "type": "notification_deleted",
  "notification_id": 1,
  "unread_count": 2
}
```

## Uso en la Aplicación

### 1. Icono de Notificaciones

El icono se muestra automáticamente en el sidebar junto al perfil del usuario:

```jsx
<NotificationIcon 
  onClick={toggleNotifications}
  className="ms-2"
/>
```

### 2. Panel de Notificaciones

El panel se muestra cuando se hace clic en el icono:

```jsx
<NotificationPanel 
  isOpen={showNotifications} 
  onClose={closeNotifications}
/>
```

### 3. Hook useNotifications

```jsx
const {
  notifications,        // Lista de notificaciones
  unreadCount,         // Contador de no leídas
  loading,             // Estado de carga
  markAsRead,          // Marcar como leída
  markAllAsRead,       // Marcar todas como leídas
  loadNotifications,   // Cargar notificaciones
  connectSocket,       // Conectar WebSocket
  disconnectSocket     // Desconectar WebSocket
} = useNotificationContext();
```

## Estilos CSS

Los estilos están en `src/components/notifications/Notifications.css` e incluyen:

- **Icono animado** con badge de notificaciones
- **Panel desplegable** con diseño moderno
- **Notificaciones diferenciadas** por tipo y estado
- **Responsive design** para móviles
- **Efectos hover** y transiciones suaves

## Configuración de Desarrollo

### Variables de Entorno

```env
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_WS_URL=ws://127.0.0.1:8000
```

### Dependencias Requeridas

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "axios": "^1.0.0",
  "react-toastify": "^9.0.0",
  "bootstrap": "^5.0.0",
  "bootstrap-icons": "^1.0.0"
}
```

## Características Técnicas

### WebSocket
- **Reconexión automática** cada 3 segundos si se pierde la conexión
- **Manejo de errores** robusto
- **Limpieza de recursos** al desmontar componentes

### API REST
- **Interceptores** para agregar tokens automáticamente
- **Manejo de errores** con toasts informativos
- **Paginación** para listas grandes de notificaciones

### Estado Global
- **Context API** para compartir estado entre componentes
- **Hook personalizado** para lógica reutilizable
- **Persistencia** de estado durante la sesión

## Próximos Pasos

1. **Configurar el backend** con los endpoints requeridos
2. **Implementar WebSocket** en el servidor
3. **Probar la integración** con datos reales
4. **Ajustar estilos** según el diseño de la aplicación
5. **Agregar tests** unitarios y de integración

## Troubleshooting

### WebSocket no se conecta
- Verificar que el servidor WebSocket esté corriendo
- Comprobar la URL del WebSocket en el código
- Revisar la consola del navegador para errores

### Notificaciones no se cargan
- Verificar que el usuario esté autenticado
- Comprobar que el token JWT sea válido
- Revisar los endpoints de la API REST

### Estilos no se aplican
- Verificar que el archivo CSS esté importado
- Comprobar que Bootstrap esté cargado
- Revisar conflictos de CSS
