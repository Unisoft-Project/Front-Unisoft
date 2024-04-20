import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface Client {
  id: number;
  tipo_documento: string;
  documento: string;
  nombre: string;
  direccion: string;
  telefono: string;
  foto_documento: string;
}


@Component({
  selector: 'app-ver-clientes',
  templateUrl: './ver-clientes.component.html'
})




export class VerClientesComponent {
  displayedColumns: string[] = ['TipoDocumento', 'Documento', 'Nombre', 'Direccion', 'Telefono'];
  dataSource: Client[] = [];
  documentTypeMap: any = {
    1: 'Cédula de Ciudadanía',
    2: 'Cédula de Extranjería',
    3: 'Tarjeta de Identidad',
    4: 'Pasaporte',
    5: 'NIT'
  };
  ngOnInit(): void {
    this.getClients()
  }

  
  constructor(private http: HttpClient) { }

  getClients() {
    this.http.get<any[]>('https://back-unisoft-lnv0.onrender.com/cliente/listaClientes')
      .subscribe(
        (response) => {
          // Map document type ID to description
          this.dataSource = response.map(client => {
            return {
              ...client,
              tipo_documento: client.tipo_documento.descripcion
            };
          });
        },
        (error) => {
          console.error('Error fetching clients:', error);
        }
      );
  }
  
  
  


}
