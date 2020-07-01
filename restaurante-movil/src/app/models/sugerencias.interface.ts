export interface SugerenciasI {
    id: string;
    tipo: string; // Queja o sugerencia
    detalle: string;
    estado: boolean;
    time?: number;
    uid_mesa?: string;
    // nombre: string;
}