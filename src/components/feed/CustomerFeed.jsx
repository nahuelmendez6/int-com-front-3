import OfferList from "../offers/OfferList";


const CustomerFeed = ({ offers, loading, error }) => (
  <div className="feed-card">
    <h2 className="feed-title">Ofertas para ti</h2>
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? <p>Cargando ofertas...</p> : <OfferList offers={offers} />}
  </div>
);

export default CustomerFeed;