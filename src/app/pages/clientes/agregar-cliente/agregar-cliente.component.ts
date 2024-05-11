import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { timeout } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Token } from '@angular/compiler';
@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent {
  selectedFile: string | ArrayBuffer | null = null; // Adjust type to File | null
  firebaseFile: File | null = null;

  clienteForm = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
    correo: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private fireStorage: AngularFireStorage, 
    private ngxService: NgxUiLoaderService
  ) {}

  async addClient(form: any) {
    this.ngxService.start();
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const data: any = {};
    if (
      !form.value.nombre ||
      !form.value.tipoDocumento ||
      !form.value.documento ||
      !form.value.direccion ||
      !form.value.telefono || 
      !form.value.email
    ) {
      this.ngxService.stop();
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; 
    } else {
      if (this.firebaseFile) {
        const file: File = this.firebaseFile as File;
        const path = `docs/${form.value.documento}`;
        this.fireStorage.upload(path, file);
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        data.foto_documento = url;
        this.ngxService.stop();
      }

      // Map document type string to corresponding ID
      if (form.value.tipoDocumento === 'Cédula de Ciudadanía') {
        data.tipo_documento = 1;
      } else if (form.value.tipoDocumento === 'Tarjeta de Identidad') {
        data.tipo_documento = 2;
      } else if (form.value.tipoDocumento === 'Cédula de Extranjería') {
        data.tipo_documento = 3;
      } else if (form.value.tipoDocumento === 'Pasaporte') {
        data.tipo_documento = 4;
      } else if (form.value.tipoDocumento === 'NIT') {
        data.tipo_documento = 5;
      }

      // Set other client data
      data.nombre = form.value.nombre;
      data.documento = form.value.documento;
      data.direccion = form.value.direccion;
      data.telefono = form.value.telefono;
      data.correo = form.value.email;
      console.log("data", data  )
      // Post client data to the server
      this.http
        .post<any>(
          'https://back-unisoft-1.onrender.com/cliente/registerCliente',
          //`http://localhost:8000/cliente/registerCliente`,
          data,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            this.ngxService.stop();
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
            this.ngxService.stop();
            // Manejo de respuesta en caso de error
            if (error.status === 400) {
              // Error 400: Bad Request
              Swal.fire({
                title: 'Error al crear cliente',
                text: 'El documento ya está registrado. Por favor, intente con otro documento.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else if (error.status === 404) {
              this.ngxService.stop();
              // Error 404: Not Found
              Swal.fire({
                title: 'Error al crear cliente',
                text: 'El documento ya está registrado. Por favor, intente con otro documento.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              this.ngxService.stop();
              // Otros errores
              Swal.fire({
                title: 'Error',
                text: 'Error al agregar cliente. Por favor, inténtelo nuevamente más tarde.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
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

  ngOnInit(): void {}

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
