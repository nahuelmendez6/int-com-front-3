import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Feed = () => {
  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar flotante */}
      <Navbar />
      
      {/* Sidebar flotante */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div 
        className="container-fluid"
        style={{
          paddingTop: '100px', // Espacio para el navbar
          paddingLeft: '280px', // Espacio para el sidebar en desktop
          paddingRight: '20px'
        }}
      >
        <div className="row">
          <div className="col-12">
            <div className="card shadow rounded-3">
              <div className="card-body p-4">
                <h1 className="card-title mb-4">Feed Principal</h1>
                <p className="text-muted">
                  Este es el espacio principal donde irá el contenido del feed.
                  Aquí se mostrarán las publicaciones, noticias y actualizaciones.
                </p>
                
                {/* Contenido placeholder */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h5 className="card-title">Publicación 1</h5>
                        <p className="card-text">
                          Este es un ejemplo de publicación que aparecerá en el feed.
                        </p>
                        <small className="text-muted">Hace 2 horas</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h5 className="card-title">Publicación 2</h5>
                        <p className="card-text">
                          Otra publicación de ejemplo para mostrar el layout del feed.
                        </p>
                        <small className="text-muted">Hace 4 horas</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ajustes responsivos para móviles */}
      <style jsx>{`
        @media (max-width: 767.98px) {
          .container-fluid {
            padding-left: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Feed;
