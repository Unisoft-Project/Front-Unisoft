import { Empresa } from './empresa.model';
import { Cliente } from './cliente.model';

export interface InfoFactura {
    oid: number;
    numero_factura: string;
    fecha_horas: string;
    empresa: Empresa
    cliente: Cliente;
}
