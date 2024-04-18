import { Routes } from '@angular/router';

import { AgregarClienteComponent } from './agregar-cliente/agregar-cliente.component';

export const clientesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-cliente',
        component: AgregarClienteComponent,
      },
      
    ],
  },
];
