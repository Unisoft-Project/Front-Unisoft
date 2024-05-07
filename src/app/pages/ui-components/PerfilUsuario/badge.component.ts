import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class AppBadgeComponent implements OnInit {

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
  // Variable para controlar la visibilidad del badge
  hidden = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Llamada a la API para obtener los datos del usuario
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario(): void {
    const url = 'https://back-unisoft-1.onrender.com/usuario';
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

    if (!token) {
      console.error('Token no encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        // Asignar los datos del usuario obtenidos de la respuesta
        this.usuario = response.usuario;
        this.empresa = response.empresa;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
        // Mostrar mensaje de error usando SweetAlert2
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Ocurrió un error al obtener los datos del usuario',
          confirmButtonText: 'Cerrar'
        });
      }
    );
  }

  // Método para guardar los datos del formulario
  guardarDatos(): void {
    // Aquí puedes implementar la lógica para guardar los datos del formulario
    console.log('Datos guardados:', this.usuario, this.empresa);

    // Mostrar mensaje de éxito usando SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Datos guardados correctamente!',
      showConfirmButton: false,
      timer: 1500 // El mensaje se mostrará durante 1.5 segundos
    });
  }

  // Método para alternar la visibilidad del badge
  toggleBadgeVisibility(): void {
    // Aquí puedes implementar la lógica para alternar la visibilidad del badge
    this.hidden = !this.hidden;
  }
}
