import React from 'react';
import { Button, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PostulationList.css';

const PostulationList = ({ postulations, loading, error, onUpdate, petitionId }) => {

    const getStatusInfo = (id_state) => {
        switch (id_state) {
            case 1: return { text: 'Pendiente', variant: 'warning' };
            case 2: return { text: 'Aprobada', variant: 'success' };
            case 3: return { text: 'Rechazada', variant: 'danger' };
            case 4: return { text: 'Ganadora', variant: 'primary' };
            default: return { text: 'Desconocido', variant: 'secondary' };
        }
    };

    if (loading) {
        return <p>Cargando postulaciones...</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!postulations || postulations.length === 0) {
        return <div className="alert alert-info">Esta petición aún no tiene postulaciones.</div>;
    }

    return (
        <ul className="list-group postulation-customer-list">
            {postulations.map((postulation) => {
                const status = getStatusInfo(postulation.id_state);
                const isActionable = postulation.id_state === 1; // Can only accept/reject pending

                return (
                    <li key={postulation.id_postulation} className="list-group-item">
                        <div className="d-flex w-100 justify-content-between mb-2">
                            <Link to={`/provider/${postulation.id_provider}`} className="provider-profile-link">
                                <div className="d-flex align-items-center">
                                    <Image
                                        src={`http://127.0.0.1:8000/${postulation.provider_user?.user.profile_image}`}
                                        roundedCircle
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                        />

                                    <div className="ms-3">
                                        <h6 className="mb-0">{postulation.provider_user?.user.name} {postulation.provider_user?.user.lastname}</h6>
                                        <small className="text-muted">{postulation.provider_user?.user.email}</small>
                                    </div>
                                </div>
                            </Link>
                            <Badge bg={status.variant}>{status.text}</Badge>
                        </div>

                        <p className="mb-2"><strong>Propuesta:</strong> {postulation.proposal}</p>

                        {postulation.budgets && postulation.budgets.length > 0 && (
                            <div className="budget-info-customer mb-2">
                                <strong>Presupuesto:</strong> ${parseFloat(postulation.budgets[0].amount).toLocaleString()} ({postulation.budgets[0].cost_type.replace('_', ' ')})
                            </div>
                        )}

                        {isActionable && (
                            <div className="actions-footer text-end">
                                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => onUpdate(postulation.id_postulation, 3, petitionId)}>
                                    Rechazar
                                </Button>
                                <Button variant="success" size="sm" onClick={() => onUpdate(postulation.id_postulation, 4, petitionId)}>
                                    Aprobar
                                </Button>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default PostulationList;
