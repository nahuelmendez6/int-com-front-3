import PetitionList from "../petitions/PetitionList";

const ProviderFeed = ({ petitions, loading, error, profile }) => (
  <div className="feed-card social-card">
    <div className="feed-card-header">
      <h2 className="feed-title">
        <i className="bi bi-clipboard-check me-2"></i>
        Peticiones para Proveedores
      </h2>
    </div>
    <div className="feed-card-body">
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
  </div>
);

export default ProviderFeed;