import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild  } from '@angular/core';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatPaginator, PageEvent, MatPaginatorIntl  } from '@angular/material/paginator';
import { Token } from '@angular/compiler';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VentasService } from 'src/app/services/ventas.service';
import { InfoFactura } from 'src/app/models/InfoFactura.model';
import { Router } from '@angular/router';



export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Dispositivos por página:';
  }
}

@Component({
  selector: 'app-ver-ventas',
  templateUrl: './ver-ventas.component.html',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})


export class VerVentasComponent{
  displayedColumns: string[] = ['Número Factura', 'Fecha', 'Cliente', 'Total Venta', 'Detalles', 'Factura', 'Editar', 'Eliminar'];



  dataSource: InfoFactura[] = [];
  errorMessage = ''
  filtro: string = '';
  modalFormato: boolean = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.getVentas()
  }


  constructor(private http: HttpClient,
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService,
    private ventasService: VentasService,
    private router: Router
    
  ) { }


  getVentas() {
    this.ngxService.start()
    this.ventasService.getAllVentas()  
      .pipe(timeout(200000))
      .subscribe(
        (res) => {
          this.dataSource = res;
          console.log(this.dataSource);
          this.ngxService.stop()
        },
        (error) => {
  
          if (error.status === 404) {
            this.errorMessage = 'No se encontraron ventas.';
          } else {
            this.errorMessage = 'Ocurrió un error al obtener las ventas.';
          }
          console.error('Error fetching Ventas:', error);
        }
      );
  }
  
  photoUrl: string | null = null;

  getFactura(oid: any) {
    console.log(oid.numero_factura)
    const photoPath = `facturas-ventas/${oid.numero_factura}`;
    if (photoPath) {
      this.storage
        .ref(photoPath)
        .getDownloadURL()
        .subscribe(
          (url) => {
            this.photoUrl = url;
            console.log(url)
            window.open(url, '_blank');
          },
          (error) => {
            this.photoUrl = null;
          }
        );
    } else {
      this.photoUrl = null;
    }
  }
  
  
  verMas(element: any) {
    //this.router.navigate(['/editar-compra', element.id]);
  }

  
  printEliminarCompra(oidVenta: any) {
    this.ngxService.start();
    console.log("oid", oidVenta);
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar la venta: IMEI: ${oidVenta} ?`,
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
          `https://back-unisoft-1.onrender.com/ventas/ventas_realizadas/${oidVenta.oid}`,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            this.ngxService.stop();
            Swal.fire({
              title: 'Venta eliminada',
              text: 'La venta se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          //  this.getDevices();
          },
          (error) => {
            this.ngxService.stop();
            if (error.status === 409) {
              Swal.fire({
                title: 'Error',
                text: 'No se puede eliminar la venta.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar la venta.',
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
  editar(oid: string) {
    this.router.navigate(['ventas/editar-venta', oid]);
  }
  paginaCambiada(event: PageEvent) {
    console.log('Page event:', event); // Verificar el evento de paginación
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    console.log('Start index:', startIndex); // Verificar el índice de inicio
    console.log('End index:', endIndex); // Verificar el índice final
    this.dataSource = this.dataSource.slice(startIndex, endIndex);
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
  getPhoto(imeil: string) {
    console.log(imeil); 
    const photoPath = `formato_compraventa/${imeil}`;
    this.modalFormato = true
    // if (photoPath) {
    //   this.storage
    //     .ref(photoPath)
    //     .getDownloadURL()
    //     .subscribe(
    //       (url) => {
    //         this.photoUrl = url;
    //         this.modalFormato = true;
    //       },
    //       (error) => {
    //         this.photoUrl = null;
    //         Swal.fire({
    //           title: 'Foto no encontrada',
    //           text: 'El usuario no tiene una foto asociada.',
    //           icon: 'error',
    //           confirmButtonText: 'OK'
    //         });
    //       }
    //     );
    // } else {
    //   this.photoUrl = null;
    //   Swal.fire({
    //     title: 'Foto no encontrada',
    //     text: 'El usuario no tiene una foto asociada.',
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    // }
  }
  closeModal() {
    this.modalFormato = false;
  }

  printDocumento(oid: any) {
    this.getPhoto(oid);
  }
}

