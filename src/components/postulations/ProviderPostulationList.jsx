import React from 'react';
import { Button } from 'react-bootstrap';
import './ProviderPostulationList.css';

const PostulationList = ({ postulations, onEdit, onDelete }) => {

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
                const canBeModified = postulation.id_state === 1; // Only pending postulations can be edited/deleted

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
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <small className="text-muted">Creado: {new Date(postulation.date_create).toLocaleDateString()}</small>
                            <div className="d-flex gap-2">
                                {canBeModified ? (
                                    <>
                                        <Button variant="outline-primary" size="sm" onClick={() => onEdit(postulation)}>
                                            <i className="bi bi-pencil-square me-1"></i>
                                            Editar
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => onDelete(postulation.id_postulation)}>
                                            <i className="bi bi-trash me-1"></i>
                                            Eliminar
                                        </Button>
                                    </>
                                ) : (
                                    <small className="text-muted">No se puede modificar</small>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default PostulationList;
