import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de login
    console.log('Login data:', formData);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow rounded-3" style={{ maxWidth: "400px", margin: "0 auto" }}>

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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Tu contraseña"
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Iniciar Sesión
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold">
                      Regístrate
                    </Link>
                  </p>
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
