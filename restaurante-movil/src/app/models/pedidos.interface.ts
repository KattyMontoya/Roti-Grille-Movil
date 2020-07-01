export interface PedidosI {
    id?: string;
    cancelado?: boolean;
    cliente?: string;
    estado: true;
    fecha?: number;
    productos?: any;
    solicitud?: string; // 0 sin datos // 1 pedido pendiente
    tipo?: string; // pagado // pendiente
    total: number;

    pedido?: number;
    factura?: boolean;
    // temperatura?: string;
    // sabor?: any;

    subtotal?: number;
    iva?: number;
    token?: string;
    uid_mesa?: string;
    mensaje?: string
    estadoPedido?: string; // *
}