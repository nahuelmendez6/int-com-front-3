# Instrucciones para Implementar el Backend de Contrataciones

Este documento describe los requisitos para el endpoint del backend necesario para la sección "Mis Contrataciones" / "Trabajos Aprobados" en el frontend.

---

### 1. Objetivo del Endpoint

Crear un único endpoint que devuelva una lista de "contrataciones", es decir, postulaciones que han sido aprobadas. El endpoint debe ser inteligente y devolver los resultados correctos según el rol del usuario que realiza la petición (cliente o proveedor).

### 2. Definición del Endpoint

- **URL:** `/api/contrataciones/`
- **Método:** `GET`
- **Autenticación:** Requerida. El sistema debe poder identificar al usuario a través del token de autenticación (`request.user`).

### 3. Lógica del Backend

La vista que maneje este endpoint (`ContratacionesAPIView`, por ejemplo) debe implementar la siguiente lógica en su método `get_queryset` o similar:

1.  **Identificar el usuario y su rol:** Obtener el `request.user` y determinar si es un cliente (`Customer`) o un proveedor (`Provider`).

2.  **Filtrar según el rol:**
    -   **Si el usuario es un Cliente:** La consulta debe buscar todas las peticiones (`Petition`) que le pertenecen y que tengan al menos una postulación (`Postulation`) con un estado de `APROBADO` (o el estado que uses para significar la aprobación).
    -   **Si el usuario es un Proveedor:** La consulta debe buscar todas sus postulaciones (`Postulation`) que tengan el estado de `APROBADO`.

### 4. Estructura de la Respuesta (Serializador)

Para que el frontend funcione correctamente, la respuesta debe ser un **array de objetos JSON**. Cada objeto representa una contratación y debe tener la siguiente estructura, la cual combina información de varios modelos:

```json
[
  {
    "id": 1, // ID único de la postulación/contratación
    "petition": {
      "id": 101,
      "title": "Necesito pintor para mi casa"
    },
    "customer": {
      "id": 5,
      "name": "Juan",
      "lastname": "Perez"
    },
    "provider": {
      "id": 13,
      "name": "Ana",
      "lastname": "Lopez",
      "profession": "Pintora"
    },
    "approved_at": "2025-10-20T10:00:00Z", // Fecha en que la postulación fue aprobada
    "final_price": 500.00 // Opcional: El precio acordado en la postulación
  }
  // ... más objetos de contratación
]
```

Para lograr esto, necesitarás crear un `ContratacionSerializer` que use serializadores anidados (nested serializers) para obtener los datos de los modelos `Petition`, `Customer` y `Provider`.

### 5. Pasos Sugeridos en Django

1.  **Crear la Vista:** Crea una `ContratacionesAPIView` usando `generics.ListAPIView` de Django Rest Framework.
2.  **Implementar `get_queryset`:** Añade la lógica de filtrado por rol de usuario en este método.
3.  **Crear el Serializador:** Define `ContratacionSerializer` con los campos anidados requeridos para producir la estructura JSON deseada.
4.  **Añadir URL:** Registra la nueva vista en tu archivo `urls.py` para que esté disponible en `/api/contrataciones/`.
