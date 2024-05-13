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
  displayedColumns: string[] = ['Número Factura', 'Fecha', 'Cliente', 'Total Venta', 'Detalles'];



  dataSource: InfoFactura[] = [];
  errorMessage = ''
  filtro: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.getVentas()
  }


  constructor(private http: HttpClient,
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService,
    private ventasService: VentasService,
    
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
  

  verMas(element: any) {
    //this.router.navigate(['/editar-compra', element.id]);
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
}

