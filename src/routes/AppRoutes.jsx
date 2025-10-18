// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "../hooks/useAuth.js";
import MainLayout from "../components/MainLayout.jsx";

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
const ProviderPublicProfilePage = lazy(() => import("../pages/ProviderPublicProfilePage.jsx")); // Componente de perfil público del proveedor
const PortfolioPage = lazy(() => import("../pages/PortfolioPage.jsx"));
const PortfolioDetailPage = lazy(() => import("../pages/PortfolioDetailPage.jsx"));
const ContratacionesPage = lazy(() => import("../pages/ContratacionesPage.jsx"));

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

// New component to wrap MainLayout and Outlet
const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRoutes = () => {
  return (
    <Loader>
      <Routes>
        {/* 🔓 Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-provider" element={<ProviderRegistrationForm />} />
        <Route path="/register-customer" element={<CustomerRegistrationForm />} />

        {/* 🔐 Rutas privadas - Envueltas por MainLayout */}
        <Route element={<PrivateRoute><LayoutWrapper /></PrivateRoute>}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/service-area" element={<ServiceAreaPage />} />
          <Route path="/petitions" element={<PetitionsPage />} />
          <Route path="/interests" element={<InterestsPage />} />
          <Route path="/petitions/:id/apply" element={<PostulationPage />} />
          <Route path="/provider/:providerId" element={<ProviderPublicProfilePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
          <Route path="/contrataciones" element={<ContratacionesPage />} />
        </Route>

        {/* 🧭 Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Loader>
  );
};

export default AppRoutes;
