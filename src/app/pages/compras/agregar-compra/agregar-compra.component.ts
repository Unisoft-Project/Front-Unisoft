import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { timeout } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-agregar-compra',
  templateUrl: './agregar-compra.component.html',
  styleUrls: ['./agregar-compra.component.css']
})

export class AgregarCompraComponent {
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


  constructor(
    private router: Router,
    private http: HttpClient,
    private fireStorage: AngularFireStorage,
    private ngxService: NgxUiLoaderService
  ) {  }

  public compraForm = {
    imei: '',
    marca_telefono: '',
    procedencia: '',
    modelo_dispositivo: '',
    descripcion: '',
    valor_compra: 0
  };

  doc = '';
  public clienteEncontrado = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  };

  ngOnInit(): void {
    this.obtenerMarcasDispositivos();
    this.consecutivo = this.generarConsecutivoFactura();  
    
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

  async addCompra(form: any) {
    const data: any = {};
    this.ngxService.start();
    if (!form.value.imei || !form.value.marca_dispositivo || !form.value.consecutivo || !form.value.modelo_dispositivo || !form.value.valor_compra
      || !this.selectedMarcaDispositivo || !this.selectedModeloDispositivo
    ) {
      this.ngxService.stop();
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });

      return;
    } else if (!this.clientFound) {
      this.ngxService.stop();
      Swal.fire({
        title: 'Debe buscar el cliente',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else {

      if (this.firebaseFile) {
        const file: File = this.firebaseFile as File;
        const path = `formato_compraventa/${form.value.imei}`;
        this.fireStorage.upload(path, file);
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        data.formato_compraventa = url;
      }

        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      data.imei = form.value.imei;
      data.consecutivo_compraventa = form.value.consecutivo;
      data.observacion = form.value.observacion;
      data.valor_compra = form.value.valor_compra;
      data.modelo_dispositivo = this.selectedModeloDispositivo;
      data.marca_dispositivo = this.selectedMarcaDispositivo;
      data.cliente_id = this.clientFound.oid;
      data.valor_venta = '0';
      data.fecha_hora = '0';
      this.http
        .post<any>(
          'https://back-unisoft-1.onrender.com/compra/compras_inventario/nueva_compra',
          data,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response: any) => {
            this.ngxService.stop();
            Swal.fire({
              title: 'La compra se ha realizado con éxito',
              text: '',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/compras/ver-compra']);
              }
            });
          },
          (error) => {
            this.ngxService.stop();
            Swal.fire({
              title: 'Error',
              text: 'Error creando la compra',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
    }
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

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['IMEI', 'Marca de Teléfono', 'Procedencia', 'Modelo del Teléfono', 'Detalles del Teléfono', 'Valor de Compra'];
  DATA: any[] = []

  addFila(form: any) {
    this.compraForm = form.value;
    const newData = this.DATA
    newData.push(this.compraForm);
    this.dataSource.data = [...newData];
  };

  getCliente(documento: string) {
    this.ngxService.start();
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${documento}`;

    this.http.get(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.clientFound = response[0];
        this.doc = documento;
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

  generarConsecutivoFactura(): string {
    const fecha = new Date();
    const fechaFormateada = `${("0" + fecha.getDate()).slice(-2)}-${("0" + (fecha.getMonth() + 1)).slice(-2)}-${fecha.getFullYear()}`;
    const horaFormateada = `${("0" + fecha.getHours()).slice(-2)}-${("0" + fecha.getMinutes()).slice(-2)}`;
    const numeroAleatorio = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const consecutivoFactura = `${fechaFormateada}-${horaFormateada}-${numeroAleatorio}`;
    return consecutivoFactura;
  }  
}
