import { Routes } from '@angular/router';
import { VerInventarioComponent } from './ver-inventario/ver-inventario.component';


export const inventarioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ver-inventario',
        component: VerInventarioComponent,
      },
      
    ],
  },
];
