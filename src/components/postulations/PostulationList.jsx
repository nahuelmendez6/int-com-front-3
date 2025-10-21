import React, { useState, useEffect } from 'react';
import { getProviderPostulations } from '../../services/postulation.service';
import { useAuth } from '../../hooks/useAuth';
import './PostulationList.css';

const PostulationList = () => {
    const { user } = useAuth();
    const [postulations, setPostulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostulations = async () => {
            if (!user) {
                setError('Debes iniciar sesión para ver tus postulaciones.');
                setLoading(false);
                return;
            }

            try {
                const data = await getProviderPostulations();
                setPostulations(data);
            } catch (err) {
                setError('Error al cargar las postulaciones. Inténtalo de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostulations();
    }, [user]);

    if (loading) {
        return <div className="postulation-list-container">Cargando postulaciones...</div>;
    }

    if (error) {
        return <div className="postulation-list-container error">{error}</div>;
    }

    if (postulations.length === 0) {
        return <div className="postulation-list-container">No has realizado ninguna postulación aún.</div>;
    }

    return (
        <div className="postulation-list-container">
            <h2>Mis Postulaciones</h2>
            <div className="postulations-grid">
                {postulations.map((postulation) => (
                    <div key={postulation.id_postulation} className="postulation-card">
                        <div className="card-header">
                            <h3>Postulación a Petición #{postulation.id_petition}</h3>
                            <span className={`status ${postulation.winner ? 'winner' : 'pending'}`}>
                                {postulation.winner ? 'Ganadora' : 'Pendiente'}
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
                ))}
            </div>
        </div>
    );
};

export default PostulationList;
