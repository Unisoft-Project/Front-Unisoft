import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { timeout } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})

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
    correo: ''
  };
  selectOption(option: string) {
    this.data.tipo_documento = option;
  }
  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService
  ) { }
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

  ngOnInit(): void { }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  searchClient(documento: string) {
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
        Swal.fire({
          title: 'Cliente encontrado',
          text: 'El cliente ha sido encontrado exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.doc = documento;
        this.clientesForm.controls['nombre'].setValue(response[0].nombre);
        this.clientesForm.controls['direccion'].setValue(response[0].direccion);
        this.clientesForm.controls['telefono'].setValue(response[0].telefono);
        this.clientesForm.controls['email'].setValue(response[0].correo);


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
      },
      (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          Swal.fire({
            title: 'Cliente no encontrado',
            text: 'El cliente no existe en la base de datos.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          this.ngxService.stop();
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

  async editClient(form: any) {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
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
      !form.value.telefono || !form.value.email
    ) {
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else {

      data.nombre = form.value.nombre;
      data.documento = form.value.documento;
      data.direccion = form.value.direccion;
      data.telefono = form.value.telefono;
      data.correo = form.value.email;
      if (this.firebaseFile) {
        const file: File = this.firebaseFile as File;
        const path = `docs/${form.value.documento}`;
        await this.storage.upload(path, file);
      }
      this.http
        .put<any>(
          `https://back-unisoft-1.onrender.com/cliente/actualizarClientes/${form.value.documento}`,
          data,
          { headers: headers }
        ).pipe(
          timeout(200000)
        ).subscribe(
          (response) => {
            this.ngxService.stop();
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
            if (error.status === 404) {
              this.ngxService.stop();
              Swal.fire({
                title: 'Cliente no encontrado',
                text: 'No se encontró el cliente',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              this.ngxService.stop();
              Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al editar el cliente',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          }

        );
    }
  }

  getPhoto(documento: string) {
    const photoPath = `docs/${documento}`;
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

  deleteSelectedPhoto(photoUrl: any) {
    const storageRef = this.storage.refFromURL(photoUrl);
    storageRef.delete().subscribe(
      () => {
      },
      (error) => { }
    );
    this.photoUrl = null;
    this.selectedFile = null;
  }
}
