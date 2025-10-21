import React from 'react';
import './PostulationList.css';

const PostulationList = ({ postulations }) => {

    const getStatusInfo = (id_state) => {
        switch (id_state) {
            case 1:
                return { text: 'Pendiente', className: 'pending' };
            case 2:
                return { text: 'Aprobada', className: 'approved' };
            case 3:
                return { text: 'Rechazada', className: 'rejected' };
            case 4:
                return { text: 'Ganadora', className: 'winner' };
            default:
                return { text: 'Desconocido', className: 'unknown' };
        }
    };

    if (!postulations || postulations.length === 0) {
        return <div className="alert alert-info">No has realizado ninguna postulación aún.</div>;
    }

    return (
        <div className="postulations-grid">
            {postulations.map((postulation) => {
                const statusInfo = getStatusInfo(postulation.id_state);
                return (
                    <div key={postulation.id_postulation} className="postulation-card">
                        <div className="card-header">
                            <h3>Postulación a Petición #{postulation.id_petition}</h3>
                            <span className={`status ${statusInfo.className}`}>
                                {statusInfo.text}
                            </span>
                        </div>
                        <div className="card-body">
                            <p><strong>Propuesta:</strong> {postulation.proposal}</p>
                            {postulation.budgets && postulation.budgets.length > 0 && (
                                <div className="budget-info">
                                    <h4>Presupuesto</h4>
                                    <p><strong>Monto:</strong> ${parseFloat(postulation.budgets[0].amount).toLocaleString()}</p>
                                    <p><strong>Tipo:</strong> {postulation.budgets[0].cost_type.replace('_', ' ')}</p>
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            <p>Fecha de creación: {new Date(postulation.date_create).toLocaleDateString()}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default PostulationList;