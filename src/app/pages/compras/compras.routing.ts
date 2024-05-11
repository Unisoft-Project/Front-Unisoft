import { Routes } from '@angular/router';
import { AgregarCompraComponent } from './agregar-compra/agregar-compra.component';
import { VerCompraComponent } from './ver-compra/ver-compra.component';


export const comprasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-compra',
        component: AgregarCompraComponent,
      },
      {
        path: 'ver-compra',
        component: VerCompraComponent,
      },
    ],
  },
];
