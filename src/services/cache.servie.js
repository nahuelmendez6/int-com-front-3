/**
 * CacheService es una clase que implementa un cache en memoria usando Map. Guarda valores
 * junto con un expiry (timestamp de vencimiento) para evitar llamadas repetidas a la API
 * dentro de un TTL (time-to-live)
 */

class CacheService {

    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 100; // 5 minutos por defecto
    }


    // generar clave unica para el cache
    generateKey(url, params = {}) {
        const sortedParams = Object.keys(params)
        .sort()
        .reduce((result, key) => {
            result[key] = params[key];
            return result;
        }, {});
        return `${url}_${JSON.stringify(sortedParams)}`;
    }

    // Obtener datos del cache
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        // Verificar si ha expirado
        if (Date.now() > item.expiry) {
        this.cache.delete(key);
        return null;
        }

        return item.data;
    }

    // Guardar datos en el cache
    set(key, data, ttl = this.defaultTTL) {
        this.cache.set(key, {
        data,
        expiry: Date.now() + ttl
        });
    }

    // Limpiar cache específico
    delete(key) {
        this.cache.delete(key);
    }

    // Limpiar todo el cache
    clear() {
        this.cache.clear();
    }

    // Limpiar cache expirado
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
            this.cache.delete(key);
        }
        }
    }

    // Obtener o establecer datos con función async
    async getOrSet(key, fetchFunction, ttl = this.defaultTTL) {
        // Intentar obtener del cache primero
        const cached = this.get(key);
        if (cached !== null) {
        return cached;
        }

        // Si no está en cache, obtener de la API
        try {
        const data = await fetchFunction();
        this.set(key, data, ttl);
        return data;
        } catch (error) {
        throw error;
        }
    }

}

// Instancia singletone
const cacheService = new CacheService();

// limpiar cache expirado cada 10 minutos

setInterval(() => {
    cacheService.cleanup();
}, 10 * 60 * 1000);

export default cacheService;