import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html'
})

//http://localhost:8000/cliente/listaClientes/documento/123456789
export class EditarClienteComponent {
  selectedFile: string | ArrayBuffer | null = null;
  @ViewChild('clientesForm', { static: true }) clientesForm: NgForm;

  
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

  deleteSelectedPhoto() {
    this.selectedFile = null;
  }

  ngOnInit(): void {}

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  searchClient(documento: string) {
    const endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${documento}`;
    this.http.get(endpoint).subscribe((response: any) => {
      // Handle the response here
   
      console.log(response);
      this.clientesForm.controls['nombre'].setValue(response[0].nombre);
      
      this.clientesForm.controls['direccion'].setValue(response[0].direccion);
      this.clientesForm.controls['telefono'].setValue(response[0].telefono);

      console.log(response[0].tipo_documento.oid)
      
      switch (response[0].tipo_documento.oid) {
        case 1:
          this.selectOption("Cédula de Ciudadanía");
          break;
        case 2:
          this.selectOption("Cédula de Extranjería")
          break;
        case 3:
          this.selectOption("Tarjeta de Identidad")
          break;
        case 4:
          this.selectOption("Pasaporte")
          break;
        case 5:
          this.selectOption("NIT")
          break;
        default:
          break;
      }
      console.log(this.clientesForm.value.tipoDocumento)
    }, (error) => {
      // Handle errors here
      console.error(error);
    });
  }
  
  editClient(form: any) {
    const data: any = {
    
    };
    //
    if(form.value.tipo_Documento === "Cédula de Ciudadanía"){
      data.tipo_documento = 1;
    } else if(form.value.tipo_Documento === "Tarjeta de Identidad"){
      data.tipo_documento = 2;
    } else if(form.value.tipo_Documento === "Cédula de Extranjería"){
      data.tipo_documento = 3;
    } else if(form.value.tipo_Documento === "Pasaporte"){
      data.tipo_documento = 4;
    } else if(form.value.tipo_Documento === "NIT"){
      data.tipo_documento = 5;
    } 
    console.log(data.tipo_documento);
    data.nombre = form.value.nombre;
    
    
    data.direccion = form.value.direccion;
    data.telefono = form.value.telefono;

    console.log("added", data)


    this.http.put<any>(`https://back-unisoft-lnv0.onrender.com/cliente/actualizarClientes/${form.value.documento}`, data)
      .subscribe(
        (response) => {
          Swal.fire({
            title: 'Cliente editado con éxito',
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

}
