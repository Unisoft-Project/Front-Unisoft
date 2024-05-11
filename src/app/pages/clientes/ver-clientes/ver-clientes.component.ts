import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface Client {
  id: number;
  tipo_documento: string;
  documento: string;
  nombre: string;
  direccion: string;
  telefono: string;
  foto_documento: string;
  correo: string
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
  displayedColumnHeaders: string[] = ['Tipo Documento', 'Documento', 'Nombre', 'Dirección', 'Teléfono', 'Correo', 'Foto', 'Eliminar'];
  dataColumns: string[] = ['TipoDocumento', 'Documento', 'Nombre', 'Direccion', 'Telefono', 'Correo', 'FotoDocumento', 'Eliminar'];
  dataSource: Client[] = [];
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
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService
  ) { }


  getClients() {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    //
    this.http.get<any[]>(
      `https://back-unisoft-1.onrender.com/cliente/listaClientes`,
      { headers: headers }
    ).pipe(
      timeout(200000)
    ).subscribe(
      (response) => {
        this.dataSource = response.map(client => {
          return {
            ...client,
            tipo_documento: client.tipo_documento.descripcion
          };
        });
        this.allClients = this.dataSource;
        this.dataSource = this.allClients.slice(0, 5);
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          this.errorMessage = 'No se encontraron clientes.';
        } else {
          this.errorMessage = 'Ocurrió un error al obtener los clientes.';
        }
      }
    );
  }

  datosOriginales: Client[] = [];
  filtrarClientes() {
    if (this.datosOriginales.length === 0) {
      this.datosOriginales = [...this.dataSource];
    }

    if (this.filtro) {
      const regex = new RegExp(this.filtro);
      this.dataSource = this.datosOriginales.filter(cliente => {
        const documentoMatch = regex.test(cliente.documento);
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

  printEliminarCliente(documento: string, nombre: string) {
    this.eliminarCliente(documento, nombre)
  }

  closeModal() {
    this.modalDocumento = false;
  }

  getPhoto(documento: string) {
    const photoPath = `docs/${documento}`;

    if (photoPath) {
      this.storage
        .ref(photoPath)
        .getDownloadURL()
        .subscribe(
          (url) => {
            this.photoUrl = url;
            this.modalDocumento = true;
          },
          (error) => {
            this.photoUrl = null;
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
      Swal.fire({
        title: 'Foto no encontrada',
        text: 'El usuario no tiene una foto asociada.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  eliminarCliente(documento: string, nombre: string) {
    this.ngxService.start();
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el cliente: ${documento} ${nombre} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        this.http.delete<any>(
          `https://back-unisoft-1.onrender.com/cliente/eliminarClientes/${documento}`,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            this.ngxService.stop();
            Swal.fire({
              title: 'Cliente eliminado',
              text: 'El cliente se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.getClients();
          },
          (error) => {
            this.ngxService.stop();
            if (error.status === 409) {
              Swal.fire({
                title: 'Error',
                text: 'No se puede eliminar el cliente porque está asociado a registros de compras.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar el cliente.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        );
      }else {
        this.ngxService.stop(); 
      }
    });
  }
  allClients: Client[] = [];
  paginaCambiada(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource = this.allClients.slice(startIndex, endIndex);
  }

  actualizarPagina() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.dataSource = this.dataSource.slice(startIndex, endIndex);
  }
}
