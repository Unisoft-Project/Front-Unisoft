import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { timeout } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Inversion } from '../interfaces/inversion.interface';

@Component({
  selector: 'app-editar-compra',
  templateUrl: './editar-compra.component.html',
  styleUrls: ['./editar-compra.component.css']
})

export class EditarCompraComponent {
  dataSource2: MatTableDataSource<Inversion> = new MatTableDataSource<Inversion>([]);
  photoUrl: string | null = null;
  documentoField: any;
  clientFoundTag: boolean = false;
  clientFound: any;
  selectedModeloDispositivo: any;
  selectedMarcaDispositivo: any;
  selectedFile: string | ArrayBuffer | null = null; 
  firebaseFile: File | null = null;
  modelosDispositivos: any[] = [];
  marcasDispositivos: any[] = [];
  consecutivo: string;
  dataSource: Inversion[] = [];
  mostrarModalInversiones = false;
  displayedColumns: string[] = ['IMEI', 'Marca de Teléfono', 'Procedencia', 'Modelo del Teléfono', 'Detalles del Teléfono', 'Valor de Compra'];
  DATA: any[] = []
  compra_inventario: any;
  fecha:any;
  inversion: any;
  oid: any;
  valor: any;
  totalInversiones: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService
  ) {  }

  public compraForm: {
    imei: string,
    consecutivo_compraventa: string,
    modelo_dispositivo: string,
    valor_compra: string,
    observacion: string,
    oid: number,
    marca_dispositivo: string,
    fecha_hora: string,
    valor_venta: string,
    cliente_id: number,
  } = {
    imei: '',
    consecutivo_compraventa: '',
    modelo_dispositivo: '',
    valor_compra: '',
    observacion: '',
    oid: 0,
    marca_dispositivo: '',
    fecha_hora: '',
    valor_venta: '',
    cliente_id: 0,
  };
  

  doc = '';
  public clienteEncontrado = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  };

  nuevaInversion: any = {
    inversion: '',
    valor: ''
  };
  
  ngOnInit(): void {
    this.obtenerMarcasDispositivos();  
    this.getCompra('43');
  }

  onMarcaSeleccionada(): void {
    this.modelosDispositivos = [];
    if (this.selectedMarcaDispositivo) {
        this.obtenerModelosDispositivos();
    } else {
        this.modelosDispositivos = [];
    }
}
   obtenerModelosDispositivos(): void {
        const url = `https://back-unisoft-1.onrender.com/modelo/modelo_dispositivo/${this.selectedMarcaDispositivo}`;
        this.http.get<any[]>(url).pipe(
          timeout(200000)
        ).subscribe(
            (data: any[]) => {
                this.modelosDispositivos = data;
            },
            (error) => {
                console.error('Error al obtener modelos de dispositivos:', error);
            }
        );
    }

  obtenerMarcasDispositivos(): void {
    const url = 'https://back-unisoft-1.onrender.com/marca/marca_dispositivo';
    this.http.get<any[]>(url).pipe(
      timeout(200000)
    ).subscribe(
      (data: any[]) => {
        this.marcasDispositivos = data;
      },
      (error) => {
          console.error('Error al obtener marcas de dispositivos:', error);
      });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
        this.firebaseFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteSelectedPhoto() {
    this.selectedFile = null;
  }


  getCompra(codCompra: string){
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const endpoint = `https://back-unisoft-1.onrender.com/compra/compras_inventarioActualizar/${codCompra}`;
    this.http.get(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        console.log(response);  
        this.ngxService.stop();
        this.compraForm.imei = response.imei;
        this.compraForm.consecutivo_compraventa = response.consecutivo_compraventa;
        this.compraForm.modelo_dispositivo = response.modelo_dispositivo;
        this.compraForm.valor_compra = response.valor_compra;
        this.compraForm.observacion = response.observacion;
        this.compraForm.oid = response.oid;
        this.compraForm.marca_dispositivo = response.marca_dispositivo;
        this.compraForm.fecha_hora = response.fecha_hora;
        this.compraForm.valor_venta = response.valor_venta;
        this.compraForm.cliente_id = response.cliente_id;
        this.selectedMarcaDispositivo = response.marca_dispositivo;
        this.getCliente(response.cliente_id, '2');
        this.obtenerModelosDispositivos();
        this.getPhoto(response.imei); 
      }, (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          Swal.fire({
            title: 'Compra no encontrada',
            text: 'La compra no existe en la base de datos.',
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

  }

  getCliente(oidCliente: string, tipoBusqueda: string ) {
    this.ngxService.start();
    var endpoint = "";
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    if(tipoBusqueda === '2'){
       endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/oidCliente/${oidCliente}`;
    }else{
      endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${oidCliente}`;
    }
    console.log(endpoint);

    this.http.get(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.clientFound = response[0];
        this.doc = response[0].documento;
        this.clientFoundTag = true;
        this.clienteEncontrado.documento = response[0].documento;
        this.clienteEncontrado.nombre = response[0].nombre;
        this.clienteEncontrado.direccion = response[0].direccion;
        this.clienteEncontrado.telefono = response[0].telefono;
      }, (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          Swal.fire({
            title: 'Cliente no encontrado',
            text: 'El cliente no existe en la base de datos.',
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
  }


  
  cerrarModalInversion() {
    this.mostrarModalInversiones = false;
    this.limpiarCamposInversion();
  }

  limpiarCamposInversion() {
    const productoVacio: Inversion  = {
      compra_inventario: 0,
      fecha: "",
      inversion: "",
      oid: 0,
      valor: "",

    };
    this.compra_inventario = productoVacio;
    this.fecha = "";
    this.inversion = false;
    this.oid = 0;
    this.valor = "";
  }

  getPhoto(imei: string) {
    const photoPath = `formato_compraventa/${imei}`;
    if (photoPath) {
      this.storage
        .ref(photoPath)
        .getDownloadURL()
        .subscribe(
          (url) => {
            this.photoUrl = url;
          },
          (error) => {
            this.photoUrl = null;
          }
        );
    } else {
      this.photoUrl = null;
    }
  }

  agregarInversionLista(inversion: Inversion) {
    if (inversion === undefined) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Primero debe ingresar una inversion',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
    else {
      this.calcularTotalInversiones();
      if (!this.validaProductoLista(inversion)) {
        inversion.inversion = this.inversion;
        this.dataSource = [...this.dataSource, inversion];
        this.mostrarModalInversiones = false;
        this.limpiarCamposInversion();
      } else {
        Swal.fire({
          title: 'Advertencia',
          text: 'El producto ya se encuentra agregado a la venta.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        });
      }
    }
    
  }
  calcularTotalInversiones(): number {
    console.log(this.dataSource2.data);
    return this.dataSource2.data.reduce((total, inversion) => {
      const valor = parseFloat(inversion.valor);
      return isNaN(valor) ? total : total + valor;
    }, 0);
  }
  

  validaProductoLista(productoBuscado: Inversion) {
    const oidInver = productoBuscado.oid;
    const existeIMEI = this.dataSource.some(inversion => inversion.oid === oidInver);
    return existeIMEI;
  }

  agregarInversionLista2(inversion: Inversion): void {
    if (inversion === undefined || !inversion.inversion || !inversion.valor) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Debe ingresar una inversión y un valor.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    } else {
      if (!this.validaInversionLista(inversion)) {
        const nuevaInversion: Inversion = { ...inversion };
        const newData = [...this.dataSource2.data, nuevaInversion];
        this.dataSource2.data = newData;
        this.cerrarModalInversion();
      } else {
        Swal.fire({
          title: 'Advertencia',
          text: 'La inversión ya se encuentra en la lista.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  }
  
  

  validaInversionLista(inversionBuscada: Inversion): boolean {
    return this.dataSource2.data.some(inversion => inversion.inversion === inversionBuscada.inversion);
  }

  eliminarInversion(inversion: Inversion) {
    const index = this.dataSource2.data.indexOf(inversion); // Accede al arreglo de datos usando la propiedad data
    if (index !== -1) {
      this.dataSource2.data.splice(index, 1); // Elimina el elemento del arreglo de datos
      this.dataSource2 = new MatTableDataSource<Inversion>(this.dataSource2.data); // Asigna el nuevo arreglo de datos a la fuente de datos
    }
  }
  
}
