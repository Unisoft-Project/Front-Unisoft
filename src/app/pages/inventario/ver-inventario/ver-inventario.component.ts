import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild  } from '@angular/core';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatPaginator, PageEvent, MatPaginatorIntl  } from '@angular/material/paginator';
import { Token } from '@angular/compiler';

/* interface Device {
  id: number;
  tipo_documento: string;
  documento: string;
  nombre: string;
  direccion: string;
  telefono: string;
  foto_documento: string;
} */

interface Device {
  oid: number;
  imei: string;
  consecutivo_compraventa: string;
  observacion: string;
  valor_venta: string;
  valor_compra: string;
  modelo_dispositivo: string;
  marca_dispositivo: string;
  fecha_hora: string;
}

export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Dispositivos por página:';
  }
}

@Component({
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: ['./ver-inventario.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})


export class VerInventarioComponent{
  displayedColumns: string[] = ['ID Compra', 'IMEI', 'Marca', 'Modelo', 'Valor Compra', 'Ver más'];
  dataSource: Device[] = [];
  loading: boolean = false;
  modalDocumento: boolean = false;
  errorMessage: string = '';
  filtro: string = '';
  photoUrl: string | null = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.getDevices("")
  }


  constructor(private http: HttpClient,
    private storage: AngularFireStorage
  ) { }



  getDevices(imei: string) {
    this.loading = true;
    const token = localStorage.getItem('token');    ;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    //
    this.http.get<any[]>(
      //TODO: Cambiar URL a Producción
      `http://localhost:8000/compra/dispositivos_disponibles/?imei=&marca_dispositivo=&modelo_dispositivo=`,
      { headers: headers }
    ).pipe(
      timeout(200000)
    ).subscribe(
      (response) => {
        console.log("response",response)
        this.loading = false;
        // Map document type ID to description
        this.dataSource = response.map(device => {
          return {
            ...device,
            //modelo_dispositivo: device.modelo_dispositivo.modelos,
            //marca_dispositivo: device.marca_dispositivo.descripcion_marca_dispositivo
          };
        });
        console.log('DataSource after mapping:', this.dataSource); // Agrega este console.log para verificar los datos en dataSource después del mapeo
        this.allClients = this.dataSource; // Asigna los datos mapeados a allClients
        this.dataSource = this.allClients.slice(0, 5); // Asigna los primeros 5 elementos de allClients a dataSource
      },
      (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.errorMessage = 'No se encontraron Dispositivos.';
        } else {
          this.errorMessage = 'Ocurrió un error al obtener los Dispositivos.';
        }
        console.error('Error fetching Devices:', error);
      }
    );
  }

  datosOriginales: Device[] = [];
  filtrarDispositivos() {
    if (this.datosOriginales.length === 0) {
      this.datosOriginales = [...this.dataSource];
    }

    this.getDevices(this.filtro);
    if (this.filtro) {
      console.log('filtro', this.filtro)
      const regex = new RegExp(this.filtro, 'i'); // Expresión regular para buscar el filtro sin distinguir mayúsculas y minúsculas
      this.dataSource = this.datosOriginales.filter(device => {
        const imeiMatch = regex.test(device.imei); // Verifica si el imei coincide con el filtro
        const marcaMatch = regex.test(device.marca_dispositivo); // Verifica si la marca coincide con el filtro
        const modeloMatch = regex.test(device.modelo_dispositivo.toString()); // Verifica si el modelo coincide con el filtro
        console.log(`Device ${device.imei}: ${imeiMatch ? 'Coincide' : 'No coincide'}`); // Mostrar si el imei coincide con el filtro
        console.log(`Device ${device.marca_dispositivo}: ${marcaMatch ? 'Coincide' : 'No coincide'}`); // Mostrar si la marca coincide con el filtro
        console.log(`Device ${device.modelo_dispositivo}: ${modeloMatch ? 'Coincide' : 'No coincide'}`); // Mostrar si el modelo coincide con el filtro
        return imeiMatch || marcaMatch || modeloMatch; // Devuelve true si alguno de los campos coincide con el filtro
      });
      const dispo = this.getDevices(this.filtro);
    } else {
      const dispo = this.getDevices(this.filtro);
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
    /* const photoPath = `docs/${documento}`;

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
    } */
  }

  eliminarCliente(documento: string) {
    /* // Mostrar cuadro de diálogo para confirmar eliminación
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar este cliente ${documento} ?`,
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
            this.getDevices();
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
    }); */
  }
  allClients: Device[] = [];
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
