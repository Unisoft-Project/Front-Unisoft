// Importaciones necesarias para definir las rutas y los componentes
import { Routes } from '@angular/router';
import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';

// Definición de las rutas de autenticación
export const AuthenticationRoutes: Routes = [
  {
    // Ruta principal del módulo de autenticación
    path: '',
    children: [
      {
        // Redirecciona a /login cuando se accede a la raíz del módulo
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        // Carga el componente AppSideLoginComponent cuando la URL es /login
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        // Carga el componente AppSideRegisterComponent cuando la URL es /register
        path: 'register',
        component: AppSideRegisterComponent,
      },
    ],
  },
];
