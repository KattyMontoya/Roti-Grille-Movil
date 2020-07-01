export interface PromocionesI {
    id: string;
    categoria?: string;
    detalle: string;
    estado: boolean;
    imagen: string;
    nombre: string;
    precio: number;
    observacion?: string;
    cantidad?: number;

    temperatura?: string;
    sabor?: any;
    time?: number;
    ingredientes?: any;
}