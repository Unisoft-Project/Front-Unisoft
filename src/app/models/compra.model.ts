import { ModeloDispositivo } from './modelo.model';
import { MarcaDispositivo } from './marca.model';

export interface CompraInventario {
    oid: number;
    imei: string;
    consecutivo_compraventa: string;
    observacion: string;
    valor_venta: string;
    valor_compra: string;
    modelo_dispositivo: ModeloDispositivo;
    marca_dispositivo: MarcaDispositivo;
}
