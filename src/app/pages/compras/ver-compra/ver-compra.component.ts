import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Component, ViewChild  } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { MatPaginator, PageEvent, MatPaginatorIntl  } from '@angular/material/paginator';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';


interface Device {
  codCompra: number;
  imei: string;
  consecutivoCompra: string;
  observacion: string;
  valorCompra: string;
  valorInversion: string;
  marca: string;
  modelo: string;
  fechaCompra: string;
  valorTotal: string;
}

export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Compras por página:';
  }
}

@Component({
  selector: 'app-ver-compra',
  templateUrl: './ver-compra.component.html',
  styleUrls: ['./ver-compra.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})


export class VerCompraComponent{
  displayedColumns: string[] = ['IMEI', 'Consecutivo', 'Marca', 'Modelo', 'Observación', 'Fecha Compra', 'Inversión', 'Compra', 'Total', 'Editar', 'Documento', 'Eliminar'];
  dataSource: Device[] = [];
  modalDocumento: boolean = false;
  errorMessage: string = '';
  filtro: string = '';
  modalFormato: boolean = false
  photoUrl: string | null = null;
  totalInversiones: number = 0;
  totalCompras: number = 0;
  total: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.getDevices();
  }


  constructor(private http: HttpClient,
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }



  getDevices() {
    this.ngxService.start();
    const token = localStorage.getItem('token');    ;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    //
    this.http.get<any[]>(
      `https://back-unisoft-1.onrender.com/compra/listaCompras`,
      { headers: headers }
    ).pipe(
      timeout(200000)
    ).subscribe(
      (response) => {
        this.dataSource = response.map(device => {
          return {
            ...device,
          };
        });
        this.totalInversiones = this.dataSource.reduce((acc, curr) => acc + parseFloat(curr.valorInversion), 0);
        this.totalCompras = this.dataSource.reduce((acc, curr) => acc + parseFloat(curr.valorCompra), 0);
        this.total = this.dataSource.reduce((acc, curr) => acc + parseFloat(curr.valorTotal), 0);
        this.allClients = this.dataSource; 
        this.dataSource = this.allClients.slice(0, 5); 
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          this.errorMessage = 'No se encontraron Dispositivos.';
        } else {
          this.errorMessage = 'Ocurrió un error al obtener los Dispositivos.';
        }
      }
    );
  }

  datosOriginales: Device[] = [];
  filtrarDispositivos() {
    if (this.datosOriginales.length === 0) {
      this.datosOriginales = [...this.dataSource];
    }

    if (this.filtro) {
      const regex = new RegExp(this.filtro);
      this.dataSource = this.datosOriginales.filter(compra => {
        const documentoMatch = regex.test(compra.imei);
        const nombreMatch = compra.consecutivoCompra.toLowerCase().includes(this.filtro.toLowerCase());
        return documentoMatch || nombreMatch;
      });
      if (this.dataSource.length === 0) {
        this.errorMessage = 'No se encontraron clientes.';
      }
    } else {
      this.getDevices();
    }
  }

  allClients: Device[] = [];
  paginaCambiada(event: PageEvent) {
    console.log('Page event:', event); 
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    console.log('Start index:', startIndex); 
    console.log('End index:', endIndex); 
    this.dataSource = this.allClients.slice(startIndex, endIndex);
    console.log('DataSource after pagination:', this.dataSource); 
  }

  actualizarPagina() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    console.log('Start index:', startIndex); 
    console.log('End index:', endIndex); 
    this.dataSource = this.dataSource.slice(startIndex, endIndex);
    console.log('DataSource after updating page:', this.dataSource); 
  }

  editar(oid: string) {
    this.router.navigate(['compras/editar-compra', oid]);
  }

  getPhoto(imeil: string) {
    console.log(imeil); 
    const photoPath = `formato_compraventa/${imeil}`;

    if (photoPath) {
      this.storage
        .ref(photoPath)
        .getDownloadURL()
        .subscribe(
          (url) => {
            this.photoUrl = url;
            this.modalFormato = true;
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
  closeModal() {
    this.modalFormato = false;
  }

  printDocumento(oid: any) {
    this.getPhoto(oid);
  }

  printEliminarCompra(oidComp: string, imei: string) {
    this.ngxService.start();
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el producto: IMEI: ${imei} ?`,
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
          `https://back-unisoft-1.onrender.com/compra/eliminarCompra/${oidComp}`,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            this.ngxService.stop();
            Swal.fire({
              title: 'Producto eliminado',
              text: 'El producto se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.getDevices();
          },
          (error) => {
            this.ngxService.stop();
            if (error.status === 409) {
              Swal.fire({
                title: 'Error',
                text: 'No se puede eliminar el producto porque está asociado a facturas.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar el producto.',
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
}
