// src/components/Login.jsx

// src/components/Login.jsx
// =====================================================
// Componente: Login
// -----------------------------------------------------
// Este componente representa el formulario de inicio de sesión
// para los usuarios del sistema (clientes y proveedores).
//
// Características:
//  - Utiliza el hook `useAuth` para manejar la autenticación.
//  - Redirige al usuario al feed principal tras el login exitoso.
//  - Muestra mensajes de error en caso de credenciales inválidas.
// =====================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import logo from '../../assets/favicon.png';
import "../../Form.css";

/**
 * Formulario de inicio de sesión para usuarios autenticables.
 *
 * @component
 * @returns {JSX.Element} Componente de formulario de login.
 *
 * @example
 * // Uso básico dentro de un enrutador de React
 * <Route path="/login" element={<Login />} />
 */
const Login = () => {
  // Hook personalizado de autenticación
  const { login } = useAuth();

  // Hook de React Router para redireccionar tras iniciar sesión
  const navigate = useNavigate();

  // Estados locales para controlar los inputs y mensajes de error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

    /**
   * Maneja el envío del formulario.
   * Intenta autenticar al usuario con las credenciales ingresadas.
   *
   * @async
   * @function handleSubmit
   * @param {Event} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/feed"); // redirigir al dashboard después del login
    } catch (err) {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  return (
    <div className="form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img 
        src={logo} 
        alt="Logo Integración Comunitaria" 
        style={{ width: '100px', marginBottom: '1rem', borderRadius: '50%' }} 
      />
      <p className="title">Integración Comunitaria</p>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="page-link">
          <span className="page-link-label">¿Olvidaste tu contraseña?</span>
        </p>
        <button className="form-btn">Iniciar Sesión</button>
      </form>
      <p className="sign-up-label">
        ¿No tienes una cuenta?
        <Link to="/register-customer" className="sign-up-link">
          Regístrate como cliente
        </Link>
        /
        <Link to="/register-provider" className="sign-up-link">
          Regístrate como proveedor
        </Link>
      </p>
      {error && <p className="text-danger text-center mt-3">{error}</p>}
    </div>
  );
};

export default Login;
