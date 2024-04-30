import { TipoDocumento } from './tipoDocumento.model';

export interface Cliente {
    oid: number;
    nombre: string;
    documento: string;
    direccion: string;
    telefono: string;
    correo: string;
    tipo_documento: TipoDocumento;
}
