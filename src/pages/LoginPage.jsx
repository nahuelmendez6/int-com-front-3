import Login from '../components/auth/Login';
import { useAuth } from '../hooks/useAuth';
import './pages-styles/LoginPage.css';

/**
 * @function Spinner
 * @description Componente funcional simple que muestra una animación de carga (spinner).
 * Se utiliza para indicar al usuario que la aplicación está en proceso
 * de verificar el estado de autenticación (ej: revisando el token JWT)
 * antes de mostrar el formulario de login.
 * @returns {JSX.Element} Un div con las clases CSS para el overlay y el spinner.
 */
const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
);

/**
 * @function LoginPage
 * @description Componente principal de la página de inicio de sesión.
 * Gestiona la visualización condicional: muestra un spinner de carga
 * mientras se verifica el estado de autenticación, o el formulario de Login
 * una vez que la verificación ha terminado.
 * * @returns {JSX.Element} El contenedor principal de la página con el componente
 * condicional (Spinner o Login).
 */
const LoginPage = () => {

  // 1. Hook para obtener el estado de autenticación
  // useAuth() proporciona acceso al contexto de autenticación, incluyendo 
  // la variable 'loading' que indica si la verificación inicial del token/usuario ha terminado.
  const { loading } = useAuth();

  return (
    <div className="login-page-container">
      {loading ? <Spinner /> : <Login />}
    </div>
  );
};

export default LoginPage;
