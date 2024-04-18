import { Routes } from '@angular/router';

import { AgregarClienteComponent } from './agregar-cliente/agregar-cliente.component';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';
import { VerClientesComponent } from './ver-clientes/ver-clientes.component';

export const clientesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-cliente',
        component: AgregarClienteComponent,
      },
      {
        path: 'editar-cliente',
        component: EditarClienteComponent,
      },
      {
        path: 'ver-clientes',
        component: VerClientesComponent,
      },
    ],
  },
];
