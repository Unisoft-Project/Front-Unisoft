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

  styleUrls: ['./ver-ventas.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})


export class VerVentasComponent{
  displayedColumns: string[] = ['Número Factura', 'Fecha', 'Cliente', 'Total Venta', 'Detalles', 'Factura', 'Eliminar'];



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
          // this.dataSource = res;
          this.dataSourcePaginada = res;
          this.dataSource = this.dataSourcePaginada.slice(0, 5);
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
  datosOriginales: any[] = [];
  filtrar(imei: any) {
    if (imei) {
      this.ngxService.start();
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      console.log(imei)
      const endpoint = `https://back-unisoft-1.onrender.com/ventas/get_venta_by_imei/${imei}`;

      this.http.get(endpoint, { headers: headers }).pipe(
        timeout(200000)
      ).subscribe(
        (response: any) => {

          console.log(response)
          //get venta
          const filteredData = this.dataSource.filter(item => item.oid === response.venta);
          console.log(filteredData);
          this.dataSource = filteredData;

         //this.paginator.firstPage(); // Reset paginator to first page
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          if (error.status === 404) {
            this.errorMessage = 'No se encontraron ventas para el IMEI proporcionado.';
          } else {
            this.errorMessage = 'Ocurrió un error al obtener las ventas.';
          }
          console.error('Error fetching Ventas:', error);
        }
      );
    } else {
      this.getVentas(); // If no IMEI provided, fetch all sales data
    }
  }

  printEliminarCompra(oidVenta: any) {
    this.ngxService.start();
    console.log("oid", oidVenta);
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar la venta con el número de factura: ${oidVenta.numero_factura}?`,
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
          `https://back-unisoft-1.onrender.com/ventas/eliminar_venta/${oidVenta.oid}`,
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

  // paginaCambiada(event: PageEvent) {
  //   console.log('Page event:', event); // Verificar el evento de paginación
  //   const startIndex = event.pageIndex * event.pageSize;
  //   const endIndex = startIndex + event.pageSize;
  //   console.log('Start index:', startIndex); // Verificar el índice de inicio
  //   console.log('End index:', endIndex); // Verificar el índice final
  //   this.dataSource = this.dataSource.slice(startIndex, endIndex);
  //   console.log('DataSource after pagination:', this.dataSource); // Verificar el dataSource después de la paginación
  // }

  // actualizarPagina() {
  //   const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //   const endIndex = startIndex + this.paginator.pageSize;
  //   console.log('Start index:', startIndex); // Verificar el índice de inicio
  //   console.log('End index:', endIndex); // Verificar el índice final
  //   // Actualiza los datos del dataSource con los clientes correspondientes a la página actual
  //   this.dataSource = this.dataSource.slice(startIndex, endIndex);
  //   console.log('DataSource after updating page:', this.dataSource); // Verificar el dataSource después de actualizar la página
  // }

  dataSourcePaginada: InfoFactura[] = [];
  paginaCambiada(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    // Crear una copia paginada del dataSource original
    this.dataSource  = this.dataSourcePaginada.slice(startIndex, endIndex);
  }

  actualizarPagina() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    // Crear una copia paginada del dataSource original
    this.dataSource = this.dataSource.slice(startIndex, endIndex);
  }

  // In your component class
  dataSourceDetalles = [];
  displayedColumnsDetalles = ['IMEI', 'Marca', 'Modelo', 'Garantía', 'Valor compra', 'Valor venta'];

  getVentaDetalles(oid: any) {
    console.log(oid.oid);

    this.ngxService.start();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const endpoint = `https://back-unisoft-1.onrender.com/ventas/get_venta_by_id/${oid.oid}`;

    this.http.get(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        this.modalFormato = true;
        console.log("Venta:", response.detalles_venta_rel[0]);
         this.dataSourceDetalles = response.detalles_venta_rel; // Assign the array directly
         console.log(this.dataSourceDetalles);
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          Swal.fire({
            title: 'Detalles no encontrados',
            text: 'No se encontraron detalles en la base de datos.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al procesar la solicitud.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );



   // /ventas/get_venta_by_id/200
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
    this.getVentaDetalles(oid);
  }
}

