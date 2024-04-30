import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FullguardiansService } from './fullguardians.service';

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
    //canActivate: [FullguardiansService],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
       canActivate: [FullguardiansService]

      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule

          ),
          canActivate: [FullguardiansService]
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./pages/clientes/clientes.module').then(
            (m) => m.ClientesModule
          ),
          canActivate: [FullguardiansService]
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./pages/ventas/ventas.module').then(
            (m) => m.VentasModule
          ),
          canActivate: [FullguardiansService]
      },
      {
        path: 'compras',
        loadChildren: () =>
          import('./pages/compras/compras.module').then(
            (m) => m.ComprasModule
          ),
          canActivate: [FullguardiansService]
      },
      {
        path: 'inventario',
        loadChildren: () =>
          import('./pages/inventario/inventario.module').then(
            (m) => m.InventarioModule
          ),

          canActivate: [FullguardiansService]
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
        canActivate: [FullguardiansService]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
