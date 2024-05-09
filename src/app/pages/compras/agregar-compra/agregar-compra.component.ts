import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { timeout } from 'rxjs/operators';


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
  selectedFile: string | ArrayBuffer | null = null; // Adjust type to File | null
  firebaseFile: File | null = null;
  modelosDispositivos: any[] = [];
  marcasDispositivos: any[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fireStorage: AngularFireStorage
  ) { }

  //* Estructura para Formulario Compras
  public compraForm = {
    imei: '',
    marca_telefono: '',
    procedencia: '',
    modelo_dispositivo: '',
    descripcion: '',
    valor_compra: 0
  };

  //* Estructura para Busqueda Cliente
  doc = '';
  public clienteEncontrado = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  };

  ngOnInit(): void {
    this.obtenerModelosDispositivos();
    this.obtenerMarcasDispositivos();
  }

  obtenerModelosDispositivos(): void {
    const url = 'https://back-unisoft-1.onrender.com/modelo/modelo_dispositivo';
    this.http.get<any[]>(url).pipe(
      timeout(200000)
    ).subscribe(
      (data: any[]) => {
        this.modelosDispositivos = data;
        console.log('Modelos de dispositivos:', this.modelosDispositivos);
      });
  }

  obtenerMarcasDispositivos(): void {
    const url = 'https://back-unisoft-1.onrender.com/marca/marca_dispositivo';
    this.http.get<any[]>(url).pipe(
      timeout(200000)
    ).subscribe(
      (data: any[]) => {
        this.marcasDispositivos = data;
        console.log('Marcas de dispositivos:', this.marcasDispositivos);
      });
  }

  async addCompra(form: any) {
    const data: any = {};
    this.loading = true;
    if (!form.value.imei || !form.value.marca_dispositivo || !form.value.consecutivo || !form.value.modelo_dispositivo || !form.value.valor_compra
      || !this.selectedMarcaDispositivo || !this.selectedModeloDispositivo
    ) {
      // Show Swal fire alert if any field is empty
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });

      return;
    } else if (!this.clientFound) {
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

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      // Set other client data
      data.imei = form.value.imei;
      data.consecutivo_compraventa = form.value.consecutivo;
      data.observacion = form.value.observacion;
      data.valor_compra = form.value.valor_compra;
      data.modelo_dispositivo = this.selectedModeloDispositivo;
      data.marca_dispositivo = this.selectedMarcaDispositivo;
      data.cliente_id = this.clientFound.oid;
      data.valor_venta = '0';
      data.fecha_hora = '0';
      console.log(data);
      // TODO Revisar los campos y averiguar como concatenar info dispositivo + info cliente en un mismo paquete de datos
      // Realizar la solicitud POST con los datos y encabezados
      this.http
        .post<any>(
          'https://back-unisoft-1.onrender.com/compra/compras_inventario/nueva_compra',
          data,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response: any) => {
            this.loading = false;
            Swal.fire({
              title: 'La compra se ha realizado con éxito',
              text: '',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/inventario/ver-inventario']);
              }
            });
          },
          (error) => {
            this.loading = false;
            // Handle error response
            console.error('Error añadiendo la compra: ', error);
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

  //* Subida de Formato CompraVenta
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

  //* Gestión Tabla
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['IMEI', 'Marca de Teléfono', 'Procedencia', 'Modelo del Teléfono', 'Detalles del Teléfono', 'Valor de Compra'];
  DATA: any[] = []

  addFila(form: any) {
    this.compraForm = form.value;
    const newData = this.DATA
    newData.push(this.compraForm);

    this.dataSource.data = [...newData];
    console.log('Formulario Captado:', this.compraForm);
    console.log('Data Source Cargado', this.dataSource.data);
  };

  //Gestión GET Cliente
  getCliente(documento: string) {
    this.loading = true;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${documento}`;

    this.http.get(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        // Handle the response here
        this.loading = false;
        this.clientFound = response[0];
        this.doc = documento;
        this.clientFoundTag = true;
        console.log('response', response);
        this.clienteEncontrado.documento = response[0].documento;
        this.clienteEncontrado.nombre = response[0].nombre;
        this.clienteEncontrado.direccion = response[0].direccion;
        this.clienteEncontrado.telefono = response[0].telefono;
      }, (error) => {
        this.loading = false;
        // Error en la petición
        if (error.status === 404) {
          // Cliente no encontrado
          Swal.fire({
            title: 'Cliente no encontrado',
            text: 'El cliente no existe en la base de datos.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          this.loading = false;
          // Otro error
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
}
