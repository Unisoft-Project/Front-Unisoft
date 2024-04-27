import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild  } from '@angular/core';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatPaginator, PageEvent, MatPaginatorIntl  } from '@angular/material/paginator';

interface Client {
  id: number;
  tipo_documento: string;
  documento: string;
  nombre: string;
  direccion: string;
  telefono: string;
  foto_documento: string;
}

export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Clientes por página:';
  }
}

@Component({
  selector: 'app-ver-clientes',
  templateUrl: './ver-clientes.component.html',
  styleUrls: ['./agregar-cliente.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})




export class VerClientesComponent {
  displayedColumns: string[] = ['TipoDocumento', 'Documento', 'Nombre', 'Direccion', 'Telefono', 'FotoDocumento', 'Eliminar'];
  dataSource: Client[] = [];
  loading: boolean = false;
  modalDocumento: boolean = false;
  errorMessage: string = '';
  filtro: string = '';
  photoUrl: string | null = null;
  documentTypeMap: any = {
    1: 'Cédula de Ciudadanía',
    2: 'Cédula de Extranjería',
    3: 'Tarjeta de Identidad',
    4: 'Pasaporte',
    5: 'NIT'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.getClients()
  }


  constructor(private http: HttpClient,
    private storage: AngularFireStorage
  ) { }

  

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
        console.log('DataSource after mapping:', this.dataSource); // Agrega este console.log para verificar los datos en dataSource después del mapeo
        this.allClients = this.dataSource; // Asigna los datos mapeados a allClients
        this.dataSource = this.allClients.slice(0, 5); // Asigna los primeros 5 elementos de allClients a dataSource
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

  datosOriginales: Client[] = [];
  filtrarClientes() {
    if (this.datosOriginales.length === 0) {
      this.datosOriginales = [...this.dataSource];
    }
   
    if (this.filtro) {
      const regex = new RegExp(this.filtro); // Expresión regular para buscar el número en cualquier posición del documento
      this.dataSource = this.datosOriginales.filter(cliente => {
        const documentoMatch = regex.test(cliente.documento); // Verifica si el número especificado está presente en el documento
        console.log(`Documento ${cliente.documento}: ${documentoMatch ? 'Coincide' : 'No coincide'}`); // Mostrar si el documento coincide con el filtro
        const nombreMatch = cliente.nombre.toLowerCase().includes(this.filtro.toLowerCase());
        return documentoMatch || nombreMatch;
      });
      if (this.dataSource.length === 0) {
        this.errorMessage = 'No se encontraron clientes.';
      } 
    } else {
      this.getClients();
    }
  }

  printDocumento(documento: string) {
    this.getPhoto(documento);
  }

  printEliminarCliente(documento: string) {
    this.eliminarCliente(documento)
  }

  closeModal() {
    this.modalDocumento = false;
  }

  getPhoto(documento: string) {
    const photoPath = `docs/${documento}`;
  
    if (photoPath) {
      // Get the download URL of the photo using the retrieved path
      this.storage
        .ref(photoPath)
        .getDownloadURL()
        .subscribe(
          (url) => {
            // Asigna el URL de descarga a la propiedad photoUrl
            this.photoUrl = url;
            // Abre el modal después de cargar la imagen
            this.modalDocumento = true;
          },
          (error) => {
            console.error('Error fetching photo:', error);
            // Set photoUrl to null to avoid displaying broken image
            this.photoUrl = null;
            console.log(`Photo with documento ${documento} not found`);
            // Muestra una alerta indicando que el usuario no tiene foto
            Swal.fire({
              title: 'Foto no encontrada',
              text: 'El usuario no tiene una foto asociada.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
    } else {
      this.photoUrl = null;
      // Muestra una alerta indicando que el usuario no tiene foto
      Swal.fire({
        title: 'Foto no encontrada',
        text: 'El usuario no tiene una foto asociada.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  eliminarCliente(documento: string) {
    // Mostrar cuadro de diálogo para confirmar eliminación
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar este cliente ${documento} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {  
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        // Realizar solicitud de eliminación si se confirma
        this.http.delete<any>(
          `https://back-unisoft-1.onrender.com/cliente/eliminarClientes/${documento}`,
          // `http://localhost:8000/cliente/eliminarClientes/${documento}`,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            // Mostrar mensaje de éxito si la eliminación fue exitosa
            Swal.fire({
              title: 'Cliente eliminado',
              text: 'El cliente se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.getClients();
          },
          (error) => {
            if (error.status === 409) {
              // Si el servidor devuelve un código de estado 409 (CONFLICT),
              // significa que no se puede eliminar el cliente debido a una restricción de clave externa
              Swal.fire({
                title: 'Error',
                text: 'No se puede eliminar el cliente porque está asociado a registros de compras.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              // Mostrar mensaje de error genérico si ocurre otro tipo de error
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar el cliente.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        );
      }
    });
  }
  allClients: Client[] = [];
  paginaCambiada(event: PageEvent) {
    console.log('Page event:', event); // Verificar el evento de paginación
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    console.log('Start index:', startIndex); // Verificar el índice de inicio
    console.log('End index:', endIndex); // Verificar el índice final
    this.dataSource = this.allClients.slice(startIndex, endIndex);
    console.log('DataSource after pagination:', this.dataSource); // Verificar el dataSource después de la paginación
  }
  
  actualizarPagina() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    console.log('Start index:', startIndex); // Verificar el índice de inicio
    console.log('End index:', endIndex); // Verificar el índice final
    // Actualiza los datos del dataSource con los clientes correspondientes a la página actual
    this.dataSource = this.dataSource.slice(startIndex, endIndex);
    console.log('DataSource after updating page:', this.dataSource); // Verificar el dataSource después de actualizar la página
  }
}
