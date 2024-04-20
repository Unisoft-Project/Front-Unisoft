import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
})

//http://localhost:8000/cliente/listaClientes/documento/123456789
export class EditarClienteComponent {
  selectedFile: string | ArrayBuffer | null = null;
  photoUrl: string | null = null;
  firebaseFile: File | null = null;
  @ViewChild('clientesForm', { static: true }) clientesForm: NgForm;

  doc = '';
  data = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  };
  selectOption(option: string) {
    this.data.tipo_documento = option;
  }
  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {}
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

  ngOnInit(): void {}

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  searchClient(documento: string) {
    const endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${documento}`;
    this.http.get(endpoint).subscribe(
      (response: any) => {
        // Handle the response here
        this.doc = documento;
        console.log(response);
        this.clientesForm.controls['nombre'].setValue(response[0].nombre);

        this.clientesForm.controls['direccion'].setValue(response[0].direccion);
        this.clientesForm.controls['telefono'].setValue(response[0].telefono);

        console.log(response[0].tipo_documento.oid);

        switch (response[0].tipo_documento.oid) {
          case 1:
            this.selectOption('Cédula de Ciudadanía');
            break;
          case 2:
            this.selectOption('Cédula de Extranjería');
            break;
          case 3:
            this.selectOption('Tarjeta de Identidad');
            break;
          case 4:
            this.selectOption('Pasaporte');
            break;
          case 5:
            this.selectOption('NIT');
            break;
          default:
            break;
        }
        this.getPhoto(documento);
        console.log(this.clientesForm.value.tipoDocumento);
      },
      (error) => {
        // Handle errors here
        console.error(error);
      }
    );
  }

  async editClient(form: any) {
    const data: any = {};
    if (form.value.tipo_Documento === 'Cédula de Ciudadanía') {
      data.tipo_documento = 1;
    } else if (form.value.tipo_Documento === 'Tarjeta de Identidad') {
      data.tipo_documento = 2;
    } else if (form.value.tipo_Documento === 'Cédula de Extranjería') {
      data.tipo_documento = 3;
    } else if (form.value.tipo_Documento === 'Pasaporte') {
      data.tipo_documento = 4;
    } else if (form.value.tipo_Documento === 'NIT') {
      data.tipo_documento = 5;
    }
    if (
      !form.value.nombre ||
      !form.value.tipo_Documento ||
      !form.value.documento ||
      !form.value.direccion ||
      !form.value.telefono
    ) {
      console.log(form.value.nombre)
      console.log(form.value.tipo_Documento)
      console.log(form.value.documento)
      console.log(form.value.direccion)
      console.log(form.value.telefono)
      // Show Swal fire alert if any field is empty
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      // Exit the method if any field is empty
    } else {
      
      console.log(data.tipo_documento);
      data.nombre = form.value.nombre;
      data.documento = form.value.documento;
      data.direccion = form.value.direccion;
      data.telefono = form.value.telefono;

      console.log('added', data);
      if (this.firebaseFile) {
        const file: File = this.firebaseFile as File;
        const path = `docs/${form.value.documento}`;
        await this.storage.upload(path, file);
        console.log(file);
      }
      this.http
        .put<any>(
          `https://back-unisoft-lnv0.onrender.com/cliente/actualizarClientes/${form.value.documento}`,
          data
        )
        .subscribe(
          (response) => {
            Swal.fire({
              title: 'Cliente editado con éxito',
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

  getPhoto(documento: string) {
    const photoPath = `docs/${documento}`;

    if (photoPath) {
      // Get the download URL of the photo using the retrieved path
      this.storage
        .ref(photoPath)
        .getDownloadURL()
        .subscribe(
          (url) => {
            // Assign the download URL to the photoUrl property
            this.photoUrl = url;
            return url;
          },
          (error) => {
            console.error('Error getting download URL:', error);
          }
        );
    } else {
      console.error('Photo path not found for ID:');
    }
  }

  deleteSelectedPhoto(photoUrl: any) {
    const storageRef = this.storage.refFromURL(photoUrl);

    // Delete the file using the storage reference
    storageRef.delete().subscribe(
      () => {
        console.log('Photo deleted successfully');
        // Handle success, such as updating UI
      },
      (error) => {
        console.error('Error deleting photo:', error);
        // Handle error, such as displaying an error message
      }
    );
    this.photoUrl = null;
  }
}
