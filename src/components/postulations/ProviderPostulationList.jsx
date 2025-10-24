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
                            {postulation.materials && postulation.materials.length > 0 && (
                                <div className="materials-info mt-3">
                                    <h5>Materiales</h5>
                                    <ul className="list-group">
                                        {postulation.materials.map((material) => (
                                            <li key={material.id_postulation_material} className="list-group-item">
                                                <div className="d-flex justify-content-between">
                                                    <span>{material.material_name}</span>
                                                    <span><strong>Cantidad:</strong> {material.quantity}</span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span><strong>Precio Unitario:</strong> ${parseFloat(material.unit_price).toLocaleString()}</span>
                                                    <span><strong>Total:</strong> ${parseFloat(material.total).toLocaleString()}</span>
                                                </div>
                                                {material.notes && <small className="text-muted"><strong>Notas:</strong> {material.notes}</small>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block">Creado: {new Date(postulation.date_create).toLocaleString()}</small>
                                {postulation.date_update && new Date(postulation.date_create).getTime() !== new Date(postulation.date_update).getTime() && (
                                    <small className="text-muted d-block">Actualizado: {new Date(postulation.date_update).toLocaleString()}</small>
                                )}
                            </div>
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
