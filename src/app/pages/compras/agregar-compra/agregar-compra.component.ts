import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-agregar-compra',
  templateUrl: './agregar-compra.component.html'
})

export class AgregarCompraComponent {
  documentoField: any; 
  selectedFile: string | ArrayBuffer | null = null; // Adjust type to File | null
  firebaseFile: File | null = null;
  fireStorage: AngularFireStorage;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {}

  //* Estructura para Formulario Compras
  public compraForm = {
    imei: '',
    marca_telefono: '',
    procedencia: '',
    modelo_telefono: '',
    detalles: '',
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

  async addCompra(form: any) {
    const data: any = {};
    if (
      !form.value.imei ||
      !form.value.marca_telefono ||
      !form.value.procedencia ||
      !form.value.modelo_telefono ||
      !form.value.valor_compra
    ) {
      // Show Swal fire alert if any field is empty
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }else {
      if (this.firebaseFile) {
        const file: File = this.firebaseFile as File;
        const path = `docs/${form.value.documento}`;
        this.fireStorage.upload(path, file);
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        console.log(url);
        data.foto_documento = url;
      }

      // Set other client data
      data.nombre = form.value.nombre;
      data.documento = form.value.documento;
      data.direccion = form.value.direccion;
      data.telefono = form.value.telefono;

      // TODO Revisar los campos y averiguar como concatenar info dispositivo + info cliente en un mismo paquete de datos

      // Post client data to the server
      this.http
        .post<any>(
          '',
          // TODO Cambiar a endpoint correspondiente a agregar compras'https://back-unisoft-lnv0.onrender.com/cliente/registerCliente',
          data
        )
        .subscribe(
          (response) => {
            Swal.fire({
              title: 'Cliente agregado con éxito',
              text: '',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/clientes/ver-clientes']);
              }
            });
          },
          (error) => {
            // Handle error response
            console.error('Error adding client:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error adding client',
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
  getCliente(documento: string){
    const endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${documento}`;
    this.http.get(endpoint).subscribe(
      (response: any) => {
        // Handle the response here
        this.doc = documento;
        console.log('response',response);
        this.clienteEncontrado.nombre = response[0].nombre;
        this.clienteEncontrado.direccion = response[0].direccion;
        this.clienteEncontrado.telefono = response[0].telefono;
      },(error) => {
        // Handle errors here
        console.error(error);
      }
    );
  }
}
