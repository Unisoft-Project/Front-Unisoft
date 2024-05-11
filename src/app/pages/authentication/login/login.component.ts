import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  email: string;
  password: string;
  loading: boolean = false;
  constructor(private http: HttpClient, private router: Router, private ngxService: NgxUiLoaderService) {}

  async login() {
    this.ngxService.start();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      email: this.email,
      password: this.password
    };

    try {
      const response = await this.http.post<any>('https://back-unisoft-1.onrender.com/auth/login', body, { headers: headers }).toPromise();
      console.log(body);
      console.log(response.token);
      console.log(response); // Agrega esto para depurar
      if (response.message !== null && response.message !== false) { 
        this.ngxService.stop();
        localStorage.setItem('token', response.message);
        this.router.navigate(['/dashboard']);
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: '¡Bienvenido!',
        });
      } else {
        this.ngxService.stop();
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Credenciales incorrectas',
        });
      }
    } catch (error) {
      this.ngxService.stop();
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Por favor, intenta de nuevo más tarde',
      });
    }
  }
}