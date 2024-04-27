import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { timeout } from 'rxjs/operators';

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
  templateUrl: './ver-clientes.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})




export class VerClientesComponent {
  displayedColumns: string[] = ['TipoDocumento', 'Documento', 'Nombre', 'Direcciòn', 'Telefono', 'FotoDocumento'];
  dataSource: Client[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  filtro: string = '';
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
    this.loading = true;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    //
     this.http.get<any[]>(
        `https://back-unisoft-1.onrender.com/cliente/listaClientes`,
        //`http://localhost:8000/cliente/listaClientes`,
        { headers: headers }
      ).pipe(
        timeout(200000)
      ).subscribe(
        (response) => {
          this.loading = false;
          // Map document type ID to description
          this.dataSource = response.map(client => {
            return {
              ...client,
              tipo_documento: client.tipo_documento.descripcion
            };
          });
        },
        (error) => {
          this.loading = false;
          if (error.status === 404) {
            this.errorMessage = 'No se encontraron clientes.';
          } else {
            this.errorMessage = 'Ocurrió un error al obtener los clientes.';
          }
          console.error('Error fetching clients:', error);
          }
      );
  }

  filtrarClientes() {
    if (this.filtro) {
      // Filtrar la lista de clientes por documento o nombre exacto
      this.dataSource = this.dataSource.filter(cliente => {
        const documentoMatch = cliente.documento.toLowerCase() === this.filtro.toLowerCase();
        const nombreMatch = cliente.nombre.toLowerCase() === this.filtro.toLowerCase();
        return documentoMatch || nombreMatch;
      });
    } else {
      // Si el campo de filtro está vacío, mostrar todos los clientes nuevamente
      this.getClients();
    }
  }
}
