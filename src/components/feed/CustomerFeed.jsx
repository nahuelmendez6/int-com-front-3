// src/components/customer/CustomerFeed.jsx
// =====================================================
// Componente: CustomerFeed
// -----------------------------------------------------
// Muestra un listado de ofertas disponibles para el cliente,
// gestionando los estados de carga (loading) y error.
// Cuando la información está lista, delega el renderizado
// de las ofertas al componente `OfferList`.
//
// Dependencias:
//  - OfferList: componente que representa la lista de ofertas
//  - Bootstrap: para los estilos y el spinner de carga
// =====================================================

import OfferList from "../offers/OfferList";


/**
 * Renderiza el "feed" de ofertas para el cliente.
 * Gestiona el estado de carga y los posibles errores.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.offers - Lista de ofertas disponibles para mostrar.
 * @param {boolean} props.loading - Indica si los datos están cargándose.
 * @param {string|null} props.error - Mensaje de error si ocurre un fallo al cargar las ofertas.
 *
 * @example
 * <CustomerFeed
 *   offers={offersData}
 *   loading={isLoading}
 *   error={fetchError}
 * />
 */
const CustomerFeed = ({ offers, loading, error }) => (
  <div>
    {error && (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    )}
    {loading ? (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando ofertas...</p>
      </div>
    ) : (
      <OfferList offers={offers} />
    )}
  </div>
);

export default CustomerFeed;