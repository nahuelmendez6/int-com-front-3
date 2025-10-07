// src/components/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div
              className="card shadow rounded-3"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="card-title fw-bold">Iniciar Sesión</h2>
                  <p className="text-muted">Ingresa tus credenciales</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Tu contraseña"
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Iniciar Sesión
                    </button>
                  </div>

                  {error && (
                    <p className="text-danger text-center mt-3">{error}</p>
                  )}
                </form>

                <div className="text-center mt-4">
                  <p className="mb-2">
                    ¿No tienes cuenta? 
                  </p>
                  <div className="d-grid gap-2">
                    <Link
                      to="/register-provider"
                      className="btn btn-outline-secondary"
                    >
                      Registrarse como proveedor
                    </Link>
                    <Link
                      to="/register-customer"
                      className="btn btn-outline-secondary"
                    >
                      Registrarse como cliente
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
