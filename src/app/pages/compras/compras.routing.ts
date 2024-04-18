import { Routes } from '@angular/router';
import { AgregarCompraComponent } from './agregar-compra/agregar-compra.component';


export const comprasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-compra',
        component: AgregarCompraComponent,
      },
      
    ],
  },
];
