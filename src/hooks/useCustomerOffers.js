import { useState, useEffect } from 'react';
import { getCustomerFeedOffers } from '../services/offers.service';

export const useCustomerOffers = (profile, authLoading) => {

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchOffers = async () => {
            if (!profile || profile.role !== 'customer') {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data } = await getCustomerFeedOffers();
                setOffers(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching customer offers:', err);
                setError('Error al cargar las ofertas para clientes.');
            } finally {
                setLoading(false);
            }
            };

            if (!authLoading) fetchOffers();
    }, [profile, authLoading]);

    return { offers, loading, error };

}