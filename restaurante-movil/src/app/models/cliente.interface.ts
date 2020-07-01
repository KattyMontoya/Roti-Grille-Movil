export interface ClienteI {
    id?: string;
    nombre: string;
    apellido: string;
    cedula: string;
    contacto: number;
    direccion?: string;
    email?: string;
    estado: boolean;
    perfil?: string;
    time_registro?: number;
}