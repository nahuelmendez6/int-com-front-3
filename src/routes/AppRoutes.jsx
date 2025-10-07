// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Páginas
import LoginPage from "../pages/LoginPage.jsx";
// import Dashboard from "../pages/main/Dashboard";
import Feed from "../pages/Feed.jsx";
import Profile from "../pages/Profile.jsx";
import AvailabilityPage from "../pages/AvailabilityPage.jsx";
import OffersPage from "../pages/OffersPage.jsx";

import ProviderRegistrationForm from "../pages/ProviderRegistrationForm.jsx";
import CustomerRegistrationForm from "../pages/CustomerRegistrationForm.jsx";

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // o un spinner

  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register-provider" element={<ProviderRegistrationForm />} />
        <Route path="/register-customer" element={<CustomerRegistrationForm />} />

        {/* Rutas privadas */}

        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>  
          }
        
        />

        <Route
          path="/availability"
          element={
            <PrivateRoute>
              <AvailabilityPage />
            </PrivateRoute>  
          }
        />

        <Route
          path="/offers"
          element={
            <PrivateRoute>
              <OffersPage />
            </PrivateRoute>  
          }
        />

        {/* Ruta catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
