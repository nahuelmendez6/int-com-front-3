# Mejoras necesarias para el backend de mensajes

## 1. Serializers faltantes

### MessageSerializer
```python
# serializers.py
from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_first_name = serializers.CharField(source='sender.first_name', read_only=True)
    sender_last_name = serializers.CharField(source='sender.last_name', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_username', 'sender_first_name', 'sender_last_name', 'content', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']
```

### ConversationSerializer mejorado
```python
# serializers.py
from rest_framework import serializers
from .models import Conversation, Message

class ConversationSerializer(serializers.ModelSerializer):
    participans = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'participans', 'created_at', 'last_message', 'unread_count']
    
    def get_participans(self, obj):
        from authentication.serializers import UserSerializer
        return UserSerializer(obj.participans.all(), many=True).data
    
    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0
```

## 2. Views faltantes

### ConversationViewSet completo
```python
# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Conversation, Message
from authentication.models import Customer, Provider
from django.contrib.auth import get_user_model
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework import viewsets

User = get_user_model()

class ConversationViewSet(viewsets.ViewSet):

    def list(self, request):
        qs = Conversation.objects.filter(participans=request.user).prefetch_related('participans', 'messages')
        serializer = ConversationSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        participant_id = request.data.get('participant_id')

        if not participant_id:
            return Response(
                {"detail": "participant_id es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Intentamos obtener el usuario desde Customer
        try:
            participant_user = Customer.objects.get(id_customer=participant_id).user
        except Customer.DoesNotExist:
            # Si no es un Customer, intentamos Provider
            try:
                participant_user = Provider.objects.get(id_provider=participant_id).user
            except Provider.DoesNotExist:
                return Response(
                    {"detail": "No existe un Customer ni Provider con ese ID"},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Verificar si ya existe una conversación entre estos usuarios
        existing_conversation = Conversation.objects.filter(
            participans=request.user
        ).filter(
            participans=participant_user
        ).distinct().first()

        if existing_conversation:
            serializer = ConversationSerializer(existing_conversation, context={'request': request})
            return Response(serializer.data)

        # Crear la conversación
        conversation = Conversation.objects.create()
        conversation.participans.add(request.user, participant_user)

        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = get_object_or_404(Conversation, pk=pk, participans=request.user)
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 50))
        
        messages = conversation.messages.order_by('-created_at')[
            (page - 1) * limit:page * limit
        ]
        
        serializer = MessageSerializer(messages, many=True)
        return Response({
            'results': serializer.data,
            'count': conversation.messages.count(),
            'page': page,
            'limit': limit
        })

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        conversation = get_object_or_404(Conversation, pk=pk, participans=request.user)
        
        # Marcar todos los mensajes no leídos como leídos (excepto los del usuario actual)
        conversation.messages.filter(
            is_read=False
        ).exclude(
            sender=request.user
        ).update(is_read=True)
        
        return Response({'status': 'messages marked as read'})

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        # Buscar conversaciones por nombre de participante
        conversations = Conversation.objects.filter(
            participans=request.user
        ).filter(
            Q(participans__first_name__icontains=query) |
            Q(participans__last_name__icontains=query) |
            Q(participans__username__icontains=query)
        ).distinct()
        
        serializer = ConversationSerializer(conversations, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        conversations = Conversation.objects.filter(participans=request.user)
        total_conversations = conversations.count()
        unread_messages = Message.objects.filter(
            conversation__in=conversations,
            is_read=False
        ).exclude(sender=request.user).count()
        
        return Response({
            'total_conversations': total_conversations,
            'unread_messages': unread_messages
        })
```

## 3. URLs actualizadas

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')

urlpatterns = [
    path('', include(router.urls)),
]
```

## 4. Consumer mejorado

```python
# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        
        # Verificar que el usuario esté autenticado
        if self.scope['user'] == AnonymousUser():
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user']

        # Guardar mensaje en DB
        from .models import Message, Conversation
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        msg = Message(conversation=conversation, sender=user, content=message)
        await database_sync_to_async(msg.save)()

        # Enviar mensaje a todos los usuarios conectados
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': user.username,
                'sender_id': user.id,
                'sender_first_name': user.first_name,
                'sender_last_name': user.last_name,
                'message_id': msg.id,
                'created_at': msg.created_at.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'sender_id': event['sender_id'],
            'sender_first_name': event['sender_first_name'],
            'sender_last_name': event['sender_last_name'],
            'message_id': event['message_id'],
            'created_at': event['created_at'],
        }))
```

## 5. Configuración de autenticación WebSocket

Asegúrate de que tu `settings.py` tenga la configuración correcta para autenticación WebSocket:

```python
# settings.py
ASGI_APPLICATION = 'tu_proyecto.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# Para autenticación WebSocket
CHANNELS_WS_PROTOCOLS = ["websockets"]
```

## 6. Cambios en el frontend ya implementados

Los siguientes cambios ya se han implementado en el frontend:

1. ✅ **messages.service.js**: Actualizado para trabajar con la nueva estructura
2. ✅ **useMessages.js**: Adaptado para manejar la estructura de `participans` como array
3. ✅ **MessagePanel.jsx**: Actualizado para mostrar información de participantes correctamente
4. ✅ **ChatWindow.jsx**: Adaptado para trabajar con la nueva estructura de datos

## Resumen de cambios necesarios en el backend:

1. **Crear MessageSerializer** para serializar mensajes
2. **Mejorar ConversationSerializer** para incluir información de participantes y estadísticas
3. **Completar ConversationViewSet** con endpoints faltantes:
   - `GET /conversations/{id}/messages/` - Obtener mensajes
   - `POST /conversations/{id}/mark-read/` - Marcar como leídos
   - `GET /conversations/search/` - Buscar conversaciones
   - `GET /conversations/stats/` - Estadísticas
4. **Mejorar ChatConsumer** para enviar más información en los mensajes WebSocket
5. **Agregar autenticación WebSocket** si no está configurada

El frontend ya está preparado para trabajar con estos cambios una vez que se implementen en el backend.
