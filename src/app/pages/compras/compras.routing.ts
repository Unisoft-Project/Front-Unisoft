import { Routes } from '@angular/router';
import { AgregarCompraComponent } from './agregar-compra/agregar-compra.component';
import { VerCompraComponent } from './ver-compra/ver-compra.component';
import { EditarCompraComponent } from './editar-compra/editar-compra.component';

export const comprasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-compra',
        component: AgregarCompraComponent,
      },
      {
        path: 'editar-compra',
        component: EditarCompraComponent,
      },
      {
        path: 'ver-compra',
        component: VerCompraComponent,
      },
    ],
  },
];
