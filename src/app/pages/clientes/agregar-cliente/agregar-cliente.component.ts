import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
})
export class AgregarClienteComponent {
  selectedFile: string | ArrayBuffer | null = null;

  clienteForm = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
  }
  constructor(private router: Router, private http: HttpClient) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  addClient(form: any) {
    const data: any = {
    
    };
    //
    if(form.value.tipoDocumento === "Cédula de Ciudadanía"){
      data.tipo_documento = "1";
    } else if(form.value.documento === "Tarjeta de Identidad"){
      data.tipo_documento = "2";
    } else if(form.value.documento === "Cédula de Extranjería"){
      data.tipo_documento = "3";
    } else if(form.value.documento === "Pasaporte"){
      data.tipo_documento = "4";
    } else if(form.value.documento === "NIT"){
      data.tipo_documento = "5";
    } 
    
    data.nombre = form.value.nombre;
    
    data.documento = form.value.documento;
    data.direccion = form.value.direccion;
    data.telefono = form.value.telefono;

    console.log("added", data)


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



  deleteSelectedPhoto() {
    this.selectedFile = null;
  }

  ngOnInit(): void {}

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
