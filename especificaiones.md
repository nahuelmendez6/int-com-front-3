Prompt para Cursor (maquetación React + Bootstrap)

Quiero crear un frontend en React con Bootstrap 5 que tenga las siguientes pantallas y componentes:

Pantallas principales:

Registro (/register)

Formulario con: nombre, email, contraseña, botón de registro.

Centrado en la pantalla con una tarjeta (card) con bordes redondeados y sombra suave.

Login (/login)

Formulario con: email, contraseña, botón de login.

También en tarjeta centrada, bordes redondeados y sombra suave.

Debajo un enlace que diga "¿No tienes cuenta? Regístrate".

Feed (/feed)

Aquí deben mostrarse el Sidebar y el Navbar flotantes.

El resto del contenido es un espacio principal vacío (luego irá el feed real).

Componentes comunes:
Sidebar (izquierdo, flotante)

Flotante en el lado izquierdo con posición fixed.

Bordes redondeados (rounded-3) y sombra (shadow).

Debe ser responsivo:

En pantallas grandes se muestra fijo a la izquierda.

En pantallas pequeñas se oculta y se puede desplegar con un botón (tipo offcanvas de Bootstrap).

Dentro del sidebar van enlaces de navegación con NavLink de react-router-dom.

Estilo: padding interno, íconos opcionales junto al texto.

Navbar (arriba, flotante)

Flotante en la parte superior con position: fixed; top: 0; width: 100% y con margenes para no tapar contenido.

Bordes redondeados y sombra suave (rounded-3 shadow).

Responsivo: en pantallas pequeñas debe colapsarse usando el componente Navbar de Bootstrap.

A la derecha debe tener un icono de usuario (ej. bi-person-circle de Bootstrap Icons) que abre un menú desplegable (dropdown).

El menú desplegable debe tener:

Enlace a Perfil

Enlace a Logout

Consideraciones extra:

Usar react-router-dom para la navegación entre páginas.

Estructura de carpetas sugerida:

src/
  components/
    Sidebar.jsx
    Navbar.jsx
  pages/
    Login.jsx
    Register.jsx
    Feed.jsx
  routes/
    AppRoutes.jsx

No agregar lógica de backend todavía (solo diseño y navegación).

Usar Bootstrap classes (container, row, col, card, btn, shadow, rounded, etc.).

Para responsividad, usar d-none d-md-block (para ocultar sidebar en móviles) y offcanvas para móviles.