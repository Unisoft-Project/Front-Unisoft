import { Routes } from '@angular/router';
import { AgregarVentaComponent } from './agregar-venta/agregar-venta.component';



export const ventasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-venta',
        component: AgregarVentaComponent,
      },
      
    ],
  },
];
