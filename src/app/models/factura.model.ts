import { Empresa } from './empresa.model';
import { Cliente } from './cliente.model';
import { VentaItem } from './venta.model';

export interface Factura {
    oid: number;
    numero_factura: string;
    fecha_hora: string;
    usuario: Empresa;
    cliente: Cliente;
    total_venta: number;
    venta_items: VentaItem[];
}
