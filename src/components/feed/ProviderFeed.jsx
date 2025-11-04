// src/components/provider/ProviderFeed.jsx
// =====================================================
// Componente: ProviderFeed
// -----------------------------------------------------
// Muestra el listado de peticiones disponibles para el proveedor,
// gestionando los estados de carga y error. Si los datos están listos,
// delega la visualización a `PetitionList`.
//
// Dependencias:
//  - PetitionList: componente que muestra la lista de peticiones
//  - Bootstrap: para los estilos visuales y el spinner de carga
// =====================================================


import PetitionList from "../petitions/PetitionList";


/**
 * Renderiza el "feed" de peticiones visibles para el proveedor.
 * Muestra errores o estados de carga según corresponda.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.petitions - Lista de peticiones disponibles.
 * @param {boolean} props.loading - Indica si los datos aún se están cargando.
 * @param {string|null} props.error - Mensaje de error si ocurre un fallo al obtener los datos.
 * @param {Object} props.profile - Perfil del usuario autenticado (proveedor).
 *
 * @example
 * <ProviderFeed
 *   petitions={petitionData}
 *   loading={isLoading}
 *   error={fetchError}
 *   profile={providerProfile}
 * />
 */
const ProviderFeed = ({ petitions, loading, error, profile }) => (
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
        <p className="mt-3 text-muted">Cargando peticiones...</p>
      </div>
    ) : (
      <PetitionList petitions={petitions} profile={profile} />
    )}
  </div>
);

export default ProviderFeed;