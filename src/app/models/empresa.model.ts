import { TipoDocumento } from "./tipoDocumento.model";

export interface Empresa {
    oid: number;
    nombre: string;
    apellido: string;
    empresa: string;
    tipo_documento_oid: TipoDocumento;
    nro_documento: string;
    nit: string;
    razon_social: string;
    direccion: string;
    telefono: string;
    firma: string;
    email: string;
}
