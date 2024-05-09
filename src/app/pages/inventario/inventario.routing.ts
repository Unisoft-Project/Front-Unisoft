import { Routes } from '@angular/router';


export const inventarioRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ver-inventario',
        //component: VerInventarioComponent,
      },
      
    ],
  },
];
