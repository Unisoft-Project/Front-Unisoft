import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  email: string;
  password: string;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8000/auth/login', body, { headers: headers })
      .subscribe(
        response => {
          console.log(body)
          console.log(response.token);
          console.log(response); // Agrega esto para depurar
          if (response.message === 'Login successful') { //"message": "Login successful"
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: '¡Bienvenido!',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al iniciar sesión',
              text: 'Credenciales incorrectas',
            });
          }
        },
        error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: 'Por favor, intenta de nuevo más tarde',
          });
        }
      );
  }

}
