import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from "@angular/fire/compat/storage";

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
})
export class AgregarClienteComponent {
  selectedFile: File | null = null; // Adjust type to File | null
  firebaseFile: File | null = null;

  clienteForm = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  }

  constructor(private router: Router, private http: HttpClient, private fireStorage: AngularFireStorage) { }

  async addClient(form: any) {
    const data: any = {};

    // Upload photo if a file is selected
    if (this.firebaseFile) {
      const file: File = this.firebaseFile as File; // Cast selectedFile to File
      const path = `docs/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      data.foto_documento = url;
      console.log("foto subida")
    }

    // Map document type string to corresponding ID
    if (form.value.tipoDocumento === "Cédula de Ciudadanía") {
      data.tipo_documento = 1;
    } else if (form.value.tipoDocumento === "Tarjeta de Identidad") {
      data.tipo_documento = 2;
    } else if (form.value.tipoDocumento === "Cédula de Extranjería") {
      data.tipo_documento = 3;
    } else if (form.value.tipoDocumento === "Pasaporte") {
      data.tipo_documento = 4;
    } else if (form.value.tipoDocumento === "NIT") {
      data.tipo_documento = 5;
    }

    // Set other client data
    data.nombre = form.value.nombre;
    data.documento = form.value.documento;
    data.direccion = form.value.direccion;
    data.telefono = form.value.telefono;

    // Post client data to the server
    this.http.post<any>('https://back-unisoft-lnv0.onrender.com/cliente/registerCliente', data)
      .subscribe(
        (response) => {
          Swal.fire({
            title: 'Cliente agregado con éxito',
            text: '',
            icon: 'success',
            confirmButtonText: 'OK'
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
            confirmButtonText: 'OK'
          });
        }
      );
  }

onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.selectedFile = e.target.result; // Assign the File object directly
        };
        reader.readAsDataURL(file);
    }
}

onFileSelectedFirebase(event: any) {
  const file: File = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          this.firebaseFile = file;
          console.log("file", file) // Assign the File object directly
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
