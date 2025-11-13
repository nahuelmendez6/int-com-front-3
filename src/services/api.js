// src/services/api.js

// src/services/api.js
// =====================================================
// Configuración central de Axios
// Este módulo define una instancia de Axios preconfigurada
// con manejo automático de token JWT y tiempo de espera.
// =====================================================
import axios from "axios";

// Crear instancia base de Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000, // Tiempo máximo de espera por respuesta (30 segundos)
});

// =====================================================
// ⚙️ Utilidades internas para el caché
// =====================================================
const DEFAULT_CACHE_TTL = 30 * 60 * 1000; // 30 minutos
const cacheStore = new Map();

const stableSerialize = (value) => {
  if (value === null || value === undefined) return `${value}`;
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(",")}}`;
};

const normalizeUrl = (baseURL = "", url = "") => {
  if (/^https?:\/\//i.test(url)) return url;
  const base = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const path = url.startsWith("/") ? url.slice(1) : url;
  return `${base}/${path}`;
};

const buildCacheKey = (method, url, config) => {
  if (config?.cacheKey) return config.cacheKey;
  const finalUrl = normalizeUrl(config?.baseURL ?? api.defaults.baseURL ?? "", url);
  const params = stableSerialize(config?.params);
  return `${method.toLowerCase()}::${finalUrl}?${params}`;
};

const cloneResponseForCache = (response, fromCache) => {
  if (!response) return response;
  const cloned = {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: {
      ...response.config,
      fromCache,
    },
    request: response.request,
  };
  if (fromCache) {
    cloned.fromCache = true;
  }
  return cloned;
};

// =====================================================
// 🛡️ Interceptor de Request
// Agrega el token JWT automáticamente a todas las solicitudes.
// =====================================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Recupera token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Inserta cabecera Authorization
  }
  return config;
});

// =====================================================
// 🧠 Sobrescritura de api.get para incorporar caché en memoria
// =====================================================
const originalGet = api.get.bind(api);

api.get = async function getWithCache(url, config = {}) {
  const {
    cache: cacheEnabled = true,
    cacheKey,
    cacheTTL,
    cacheForceRefresh = false,
    cacheOnError = false,
    ...axiosConfig
  } = config ?? {};

  const ttl = typeof cacheTTL === "number" ? cacheTTL : DEFAULT_CACHE_TTL;
  const key = cacheKey ?? buildCacheKey("get", url, axiosConfig);

  if (cacheEnabled && !cacheForceRefresh) {
    const cached = cacheStore.get(key);
    if (cached && Date.now() - cached.timestamp <= cached.ttl) {
      return cloneResponseForCache(cached.response, true);
    }
  }

  try {
    const response = await originalGet(url, axiosConfig);
    if (cacheEnabled) {
      cacheStore.set(key, {
        timestamp: Date.now(),
        ttl,
        response: cloneResponseForCache(response, false),
      });
    }
    return response;
  } catch (error) {
    if (!cacheOnError) {
      cacheStore.delete(key);
    }
    throw error;
  }
};

// =====================================================
// ♻️ Helpers públicos para manejar el caché
// =====================================================
api.cache = {
  clear: () => cacheStore.clear(),
  delete: (key) => cacheStore.delete(key),
  keys: () => Array.from(cacheStore.keys()),
  size: () => cacheStore.size,
  invalidateByUrl: (url) => {
    if (!url) return;
    const normalized = normalizeUrl(api.defaults.baseURL ?? "", url);
    cacheStore.forEach((value, storedKey) => {
      if (storedKey.includes(normalized)) {
        cacheStore.delete(storedKey);
      }
    });
  },
};

// =====================================================
// 🔄 Limpiar la caché ante operaciones de escritura
// =====================================================
api.interceptors.response.use(
  (response) => {
    const method = response?.config?.method?.toLowerCase?.();
    if (method && method !== "get") {
      api.cache.clear();
    }
    return response;
  },
  (error) => {
    const method = error?.config?.method?.toLowerCase?.();
    if (method && method !== "get") {
      api.cache.clear();
    }
    return Promise.reject(error);
  }
);

export default api;
