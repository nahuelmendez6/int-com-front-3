// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "../hooks/useAuth.js";

// 🔹 Lazy load de las páginas para mejorar rendimiento
const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const Feed = lazy(() => import("../pages/Feed.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const AvailabilityPage = lazy(() => import("../pages/AvailabilityPage.jsx"));
const OffersPage = lazy(() => import("../pages/OffersPage.jsx"));
const ServiceAreaPage = lazy(() => import("../pages/ServiceAreaPage.jsx"));
const PetitionsPage = lazy(() => import("../pages/PetitionsPage.jsx"));
const InterestsPage = lazy(() => import("../pages/InterestsPage.jsx"));
const PostulationPage = lazy(() => import("../pages/PostulationPage.jsx"));
const ProviderRegistrationForm = lazy(() => import("../pages/ProviderRegistrationForm.jsx"));
const CustomerRegistrationForm = lazy(() => import("../pages/CustomerRegistrationForm.jsx"));

// 🔒 Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// 🔧 Envoltorio para manejar el Suspense (lazy loading)
const Loader = ({ children }) => (
  <Suspense
    fallback={
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    }
  >
    {children}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Loader>
      <Routes>
        {/* 🔓 Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-provider" element={<ProviderRegistrationForm />} />
        <Route path="/register-customer" element={<CustomerRegistrationForm />} />

        {/* 🔐 Rutas privadas */}
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

        <Route
          path="/service-area"
          element={
            <PrivateRoute>
              <ServiceAreaPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/petitions"
          element={
            <PrivateRoute>
              <PetitionsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/interests"
          element={
            <PrivateRoute>
              <InterestsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/petitions/:id/apply"
          element={
            <PrivateRoute>
              <PostulationPage />
            </PrivateRoute>
          }
        />

        {/* 🧭 Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Loader>
  );
};

export default AppRoutes;
