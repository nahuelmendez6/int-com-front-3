import PetitionList from "../petitions/PetitionList";

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