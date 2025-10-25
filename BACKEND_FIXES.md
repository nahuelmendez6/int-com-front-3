# Correcciones para el Backend de Notificaciones

## 🔍 Problemas Identificados

### 1. Error de Modelo User
```
Cannot resolve keyword 'id' into field. Choices are: ... id_user ...
```

**Problema**: El consumer del WebSocket está usando `User.objects.get(id=user_id)` pero el modelo User usa `id_user`.

**Solución**: En el archivo `notifications/consumers.py`:

```python
# ❌ INCORRECTO (línea 92):
return User.objects.get(id=user_id)

# ✅ CORRECTO:
return User.objects.get(id_user=user_id)
```

### 2. Error de Base de Datos
```
Unknown column 'n_notification.user_id' in 'SELECT'
```

**Problema**: La tabla de notificaciones no tiene la columna `user_id`.

**Solución**: Crear una migración para agregar la columna.

## 🔧 Pasos para Corregir

### Paso 1: Corregir el Consumer del WebSocket

En el archivo `notifications/consumers.py`, línea 92:

```python
# Cambiar de:
return User.objects.get(id=user_id)

# A:
return User.objects.get(id_user=user_id)
```

### Paso 2: Verificar el Modelo de Notificaciones

Asegúrate de que el modelo `Notification` tenga la relación correcta:

```python
# En notifications/models.py
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    # O si usas id_user:
    user_id = models.IntegerField()  # Si no usas ForeignKey
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
```

### Paso 3: Crear Migración

Si el modelo no tiene la columna `user_id`:

```bash
# En el directorio del backend
python manage.py makemigrations notifications
python manage.py migrate
```

### Paso 4: Verificar las URLs del WebSocket

En `notifications/routing.py`:

```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\w+)/$', consumers.NotificationConsumer.as_asgi()),
]
```

### Paso 5: Verificar el Consumer Completo

El consumer debe verse así:

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'notifications_{self.user_id}'
        
        # Verificar que el usuario existe
        try:
            user = await self.get_user(self.user_id)
            if not user:
                await self.close()
                return
        except:
            await self.close()
            return
        
        # Unirse al grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Enviar conteo de notificaciones no leídas
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'unread_count': unread_count
        }))

    async def disconnect(self, close_code):
        # Salir del grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data['type'] == 'mark_as_read':
            await self.mark_notification_as_read(data['notification_id'])
        elif data['type'] == 'get_unread_count':
            unread_count = await self.get_unread_count()
            await self.send(text_data=json.dumps({
                'type': 'unread_count',
                'unread_count': unread_count
            }))

    async def notification_created(self, event):
        # Enviar notificación al WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification_created',
            'notification': event['notification'],
            'unread_count': event['unread_count']
        }))

    async def get_user(self, user_id):
        from asgiref.sync import sync_to_async
        try:
            return await sync_to_async(User.objects.get)(id_user=user_id)
        except User.DoesNotExist:
            return None

    async def get_unread_count(self):
        from asgiref.sync import sync_to_async
        from .models import Notification
        
        return await sync_to_async(Notification.objects.filter(
            user_id=self.user_id, is_read=False
        ).count)()

    async def mark_notification_as_read(self, notification_id):
        from asgiref.sync import sync_to_async
        from .models import Notification
        
        await sync_to_async(Notification.objects.filter(
            id=notification_id,
            user_id=self.user_id
        ).update)(is_read=True, read_at=timezone.now())
```

## 🧪 Verificación

Después de hacer estos cambios:

1. **Reinicia el servidor Django**
2. **Verifica que no hay errores en la consola**
3. **Prueba la conexión WebSocket** desde el frontend
4. **Verifica que las notificaciones se crean correctamente**

## 📝 Notas Adicionales

- Asegúrate de que el modelo `User` tenga el campo `id_user` como clave primaria
- Si usas `id_user` como clave primaria, ajusta todas las referencias en el código
- Verifica que las migraciones se ejecuten correctamente
- Considera usar `id_user` consistentemente en todo el backend

## 🚨 Si Persisten los Errores

Si los errores persisten, verifica:

1. **Estructura de la base de datos**: `DESCRIBE notifications_notification;`
2. **Modelo User**: Verifica si usa `id` o `id_user` como clave primaria
3. **Migraciones**: Asegúrate de que todas las migraciones estén aplicadas
4. **Logs del servidor**: Revisa los logs para más detalles del error
