const DefaultFeed = () => (
  <div className="feed-card social-card">
    <div className="feed-card-header">
      <h2 className="feed-title">
        <i className="bi bi-house-door me-2"></i>
        Feed Principal
      </h2>
    </div>
    <div className="feed-card-body text-center py-5">
      <div className="mb-4">
        <i className="bi bi-info-circle" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
      </div>
      <h5 className="text-muted mb-3">¡Bienvenido a Integración Comunitaria!</h5>
      <p className="text-muted mb-0">
        Completa tu perfil para acceder a todas las funcionalidades de la plataforma.
      </p>
    </div>
  </div>
);

export default DefaultFeed;