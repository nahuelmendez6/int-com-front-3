# Sistema de Mensajes en Tiempo Real

## Descripción

Este sistema implementa mensajería en tiempo real usando WebSockets y API REST para la aplicación de Integración Comunitaria. Los mensajes se muestran en el sidebar junto a las notificaciones.

## Características Implementadas

### ✅ Componentes Principales

1. **MessageIcon** - Icono de chat con contador de mensajes no leídos
2. **MessagePanel** - Panel desplegable que muestra todas las conversaciones
3. **ChatWindow** - Ventana de chat individual para conversaciones
4. **useMessages** - Hook personalizado para gestión de estado
5. **messagesService** - Servicio para comunicación con la API REST

### ✅ Funcionalidades

- **Mensajes en tiempo real** via WebSocket
- **API REST** para gestión completa de mensajes
- **Contador de mensajes no leídos** en el icono
- **Panel desplegable** con lista de conversaciones
- **Chat individual** con ventana dedicada
- **Reconexión automática** del WebSocket
- **Toasts informativos** para nuevos mensajes
- **Búsqueda de conversaciones**
- **Diseño responsive** para móviles y desktop

## Estructura de Archivos

```
src/
├── components/
│   ├── messages/
│   │   ├── MessageIcon.jsx      # Icono de mensajes
│   │   ├── MessagePanel.jsx     # Panel de conversaciones
│   │   ├── ChatWindow.jsx       # Ventana de chat individual
│   │   └── Messages.css         # Estilos CSS
├── contexts/
│   └── MessageContext.jsx       # Contexto de mensajes
├── hooks/
│   └── useMessages.js          # Hook personalizado
└── services/
    └── messages.service.js      # Servicio API REST
```

## Endpoints del Backend Requeridos

### API REST
```javascript
// Conversaciones
GET    /conversations/              # Obtener conversaciones
POST   /conversations/              # Crear conversación
GET    /conversations/search/       # Buscar conversaciones

// Mensajes
GET    /conversations/{id}/messages/     # Obtener mensajes
POST   /conversations/{id}/messages/     # Enviar mensaje
POST   /conversations/{id}/mark-read/    # Marcar como leído

// Estadísticas
GET    /messages/stats/             # Estadísticas de mensajes
```

### WebSocket
```javascript
// Conexión
ws://127.0.0.1:8000/ws/chat/{conversation_id}/

// Eventos enviados
{
  "message": "Contenido del mensaje"
}

// Eventos recibidos
{
  "message": "Contenido del mensaje",
  "sender": "nombre_usuario",
  "sender_id": 123
}
```

## Formato de Datos

### Conversación
```json
{
  "id": 1,
  "participant": {
    "id": 123,
    "name": "Juan",
    "lastname": "Pérez",
    "profile_image": "url_imagen"
  },
  "last_message": {
    "content": "Último mensaje",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "unread_count": 3,
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Mensaje
```json
{
  "id": 1,
  "content": "Contenido del mensaje",
  "sender": "nombre_usuario",
  "sender_id": 123,
  "created_at": "2024-01-15T10:30:00Z",
  "is_own": true
}
```

## Uso en la Aplicación

### 1. Icono de Mensajes

El icono se muestra automáticamente en el sidebar junto a las notificaciones:

```jsx
<MessageIcon 
  onClick={toggleMessages}
  className="ms-1"
/>
```

### 2. Panel de Conversaciones

El panel se muestra cuando se hace clic en el icono:

```jsx
<MessagePanel 
  isOpen={showMessages} 
  onClose={closeMessages}
/>
```

### 3. Ventana de Chat

La ventana de chat se abre al seleccionar una conversación:

```jsx
<ChatWindow 
  conversation={conversation}
  onBack={handleBackToList}
  onClose={closeMessages}
/>
```

### 4. Hook useMessages

```jsx
const {
  conversations,        // Lista de conversaciones
  currentConversation, // Conversación actual
  messages,            // Mensajes de la conversación
  unreadCount,         // Contador de no leídos
  loading,             // Estado de carga
  openConversation,    // Abrir conversación
  createConversation,  // Crear conversación
  sendMessage,         // Enviar mensaje
  searchConversations  // Buscar conversaciones
} = useMessageContext();
```

## Estilos CSS

Los estilos están en `src/components/messages/Messages.css` e incluyen:

- **Icono animado** con badge de mensajes
- **Panel desplegable** con diseño moderno
- **Ventana de chat** con burbujas de mensajes
- **Responsive design** para móviles
- **Efectos hover** y transiciones suaves
- **Scroll automático** en conversaciones

## Características Técnicas

### WebSocket
- **Reconexión automática** cada 3 segundos si se pierde la conexión
- **Manejo de errores** robusto
- **Limpieza de recursos** al desmontar componentes

### API REST
- **Interceptores** para agregar tokens automáticamente
- **Manejo de errores** con toasts informativos
- **Paginación** para listas grandes de mensajes

### Estado Global
- **Context API** para compartir estado entre componentes
- **Hook personalizado** para lógica reutilizable
- **Persistencia** de estado durante la sesión

## Configuración del Backend

### Modelos Requeridos

```python
# models.py
class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
```

### Consumer WebSocket

```python
# consumers.py
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user']
        
        # Guardar mensaje en DB
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        msg = Message(conversation=conversation, sender=user, content=message)
        await database_sync_to_async(msg.save())
        
        # Enviar a todos los usuarios conectados
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': user.username,
                'sender_id': user.id_user
            }
        )
```

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

### Mensajes no se cargan
- Verificar que el usuario esté autenticado
- Comprobar que el token JWT sea válido
- Revisar los endpoints de la API REST

### Estilos no se aplican
- Verificar que el archivo CSS esté importado
- Comprobar que Bootstrap esté cargado
- Revisar conflictos de CSS
