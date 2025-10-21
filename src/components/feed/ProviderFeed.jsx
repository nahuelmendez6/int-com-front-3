import PetitionList from "../petitions/PetitionList";

const ProviderFeed = ({ petitions, loading, error, profile }) => (
  <div className="feed-card">
    <h2 className="feed-title">Peticiones para Proveedores</h2>
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? (
      <p>Cargando peticiones...</p>
    ) : (
      <PetitionList petitions={petitions} profile={profile} />
    )}
  </div>
);

export default ProviderFeed;