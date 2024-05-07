import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class AppBadgeComponent implements OnInit {

  // Variables y modelos necesarios para el badge
  nombreUsuario: string = 'Nombre del Usuario';
  usuario: any = {
    nombre: '',
    tipo_documento_oid: { descripcion: '' }, // Asegúrate de que tipo_documento_oid esté inicializado correctamente
    nro_documento: ''
  };
  empresa: any = {
    nombre: '',
    nit: '',
    razonSocial: '',
    direccion: '',
    correo: '',
    telefono: ''
  };
  // Variable para controlar la visibilidad del badge
  hidden = false;

  // Nueva propiedad para almacenar el tipo de documento seleccionado
  tipoDocumentoSeleccionado: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Llamada a la API para obtener los datos del usuario
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario(): void {
    const url = 'https://back-unisoft-1.onrender.com/usuario/1'; // Corregir la URL para incluir el ID del usuario
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

    if (!token) {
      console.error('Token no encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get(url, { headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        // Asignar los datos del usuario obtenidos de la respuesta
        if (response && response.length > 0) {
          this.usuario = response[0];
          this.empresa = {
            nombre: this.usuario.empresa,
            nit: this.usuario.nit,
            razonSocial: this.usuario.razon_social,
            direccion: this.usuario.direccion,
            correo: this.usuario.email,
            telefono: this.usuario.telefono
          };
          // Asignar el tipo de documento seleccionado
          this.tipoDocumentoSeleccionado = this.usuario.tipo_documento_oid?.descripcion || '';
        }
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
    const url = 'https://back-unisoft-1.onrender.com/usuario/1/edit';
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const usuarioActualizado = {
      ...this.usuario,
      tipo_documento_oid: this.usuario.tipo_documento_oid?.oid || '' // Asignar solo el OID del tipo de documento
    };
    
    // Enviar los datos del usuario actualizados en la solicitud PUT
    this.http.put(url, usuarioActualizado, { headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        // Manejar la respuesta del servidor
        Swal.fire({
          icon: 'success',
          title: '¡Datos actualizados correctamente!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      (error) => {
        console.error('Error al actualizar datos del usuario:', error);
        // Mostrar mensaje de error usando SweetAlert2
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Ocurrió un error al actualizar los datos del usuario',
          confirmButtonText: 'Cerrar'
        });
      }
    );
  }

  // Método para alternar la visibilidad del badge
  toggleBadgeVisibility(): void {
    // Aquí puedes implementar la lógica para alternar la visibilidad del badge
    this.hidden = !this.hidden;
  }
}
