import OfferList from "../offers/OfferList";

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