import { Routes } from '@angular/router';
import { AgregarVentaComponent } from './agregar-venta/agregar-venta.component';
import { VerVentasComponent } from './ver-ventas/ver-ventas.component';
import { EditarVentaComponent } from './editar-venta/editar-venta.component';



export const ventasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregar-venta',
        component: AgregarVentaComponent,
      },
      {
        path: 'ver-ventas',
        component: VerVentasComponent,
      },
    ],
  },
];
