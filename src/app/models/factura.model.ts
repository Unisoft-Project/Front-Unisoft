import { Empresa } from './empresa.model';
import { Cliente } from './cliente.model';
import { VentaItem } from './venta.model';
import { InfoFactura } from './InfoFactura.model';

export interface Factura {
    info_factura: InfoFactura[]
    venta_items: VentaItem[];
}
