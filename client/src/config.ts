// L'app online gira in modalità demo (dati locali). Per collegare un backend
// reale, imposta VITE_API_URL nelle variabili d'ambiente (vedi README).
export const API_URL = import.meta.env.VITE_API_URL || ''
export const HAS_BACKEND = !!API_URL