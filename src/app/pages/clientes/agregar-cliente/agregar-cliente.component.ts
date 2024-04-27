import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent {
  selectedFile: string | ArrayBuffer | null = null; // Adjust type to File | null
  firebaseFile: File | null = null;
  loading: boolean = false;

  clienteForm = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private fireStorage: AngularFireStorage
  ) {}

  async addClient(form: any) {
    this.loading = true;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const data: any = {};

    // Upload photo if a file is selected
    if (
      !form.value.nombre ||
      !form.value.tipoDocumento ||
      !form.value.documento ||
      !form.value.direccion ||
      !form.value.telefono
    ) {
      this.loading = false;
      // Show Swal fire alert if any field is empty
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Exit the method if any field is empty
    } else {
      if (this.firebaseFile) {
        const file: File = this.firebaseFile as File;
        const path = `docs/${form.value.documento}`;
        this.fireStorage.upload(path, file);
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        data.foto_documento = url;
        this.loading = false;
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

      // Post client data to the server
      this.http
        .post<any>(
          //'https://back-unisoft-lnv0.onrender.com/cliente/registerCliente'
          `http://localhost:8000/cliente/registerCliente`,
          data,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            this.loading = false;
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
            this.loading = false;
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
              this.loading = false;
              // Error 404: Not Found
              Swal.fire({
                title: 'Error al crear cliente',
                text: 'El documento ya está registrado. Por favor, intente con otro documento.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              this.loading = false;
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
