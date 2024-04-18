import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html'
})
export class EditarClienteComponent {
  selectedFile: string | ArrayBuffer | null = null;

  constructor(private router: Router) { }
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
  editClient() {
    Swal.fire({
      title: 'Cliente editado con éxito',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/clientes/ver-clientes']);
      }
    });
  }
}
