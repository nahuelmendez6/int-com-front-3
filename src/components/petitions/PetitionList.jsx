import React from 'react';

const PetitionList = ({ petitions }) => {
  return (
    <div className="container mt-4">
      <h2>Mis Peticiones</h2>
      {petitions.length === 0 ? (
        <p>No tienes peticiones creadas.</p>
      ) : (
        <ul className="list-group">
          {petitions.map((petition) => (
            <li key={petition.id_petition} className="list-group-item">
              <h5>{petition.description}</h5>
              <p><strong>Desde:</strong> {petition.date_since || 'No especificado'}</p>
              <p><strong>Hasta:</strong> {petition.date_until || 'No especificado'}</p>
              <p><strong>Estado:</strong> {petition.id_state}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PetitionList;
