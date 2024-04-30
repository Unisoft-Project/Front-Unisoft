import { CompraInventario } from './compra.model';

export interface VentaItem {
    oid: number;
    venta: any; // Type of 'venta' is not provided in the JSON
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    observacion: string;
    garantia: string;
    compra_inventario: CompraInventario[];

}
