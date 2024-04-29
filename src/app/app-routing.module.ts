import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./pages/clientes/clientes.module').then(
            (m) => m.ClientesModule
          ),
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./pages/ventas/ventas.module').then(
            (m) => m.VentasModule
          ),
      },
      {
        path: 'compras',
        loadChildren: () =>
          import('./pages/compras/compras.module').then(
            (m) => m.ComprasModule
          ),
      },
      {
        path: 'inventario',
        loadChildren: () =>
          import('./pages/inventario/inventario.module').then(
            (m) => m.InventarioModule
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
