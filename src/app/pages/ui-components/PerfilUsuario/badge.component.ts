import { Component } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class AppBadgeComponent {

  // Variables y modelos necesarios para el badge
  nombreUsuario: string = 'Nombre del Usuario';

  usuario: any = {
    nombre: '',
    tipoDocumento: 'CC',
    documento: ''
  };

  empresa: any = {
    nombre: '',
    nit: '',
    razonSocial: '',
    direccion: '',
    correo: '',
    telefono: '',
    ciudad: ''
  };

  // Método para guardar los datos del formulario
  guardarDatos(): void {
    // Aquí puedes implementar la lógica para guardar los datos del formulario
    console.log('Datos guardados:', this.usuario, this.empresa);
    // Puedes agregar más lógica aquí, como enviar los datos a un servicio
  }

  // Método para alternar la visibilidad del badge
  toggleBadgeVisibility(): void {
    // Aquí puedes implementar la lógica para alternar la visibilidad del badge
    this.hidden = !this.hidden;
  }

  // Método para calcular el valor del badge basado en los datos del formulario
  

  // Variable para controlar la visibilidad del badge
  hidden = false;
}
