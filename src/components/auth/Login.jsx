// src/components/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "../../Form.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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
    <div className="form-container">
      <p className="title">Bienvenido de vuelta</p>
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
