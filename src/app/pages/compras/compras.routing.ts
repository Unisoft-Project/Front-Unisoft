import { Routes } from '@angular/router';
import { AgregarCompraComponent } from './agregar-compra/agregar-compra.component';
import { VerInventarioComponent } from './ver-inventario/ver-inventario.component';


export const comprasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-compra',
        component: AgregarCompraComponent,
      },
      {
        path: 'ver-inventario',
        component: VerInventarioComponent,
      },
    ],
  },
];
