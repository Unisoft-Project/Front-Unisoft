import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AgregarVentaComponent } from './agregar-venta/agregar-venta.component';
import { ventasRoutes } from './ventas.routing';
import { VerVentasComponent } from './ver-ventas/ver-ventas.component';


@NgModule({
  declarations: [
    AgregarVentaComponent,
    VerVentasComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ventasRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ]
})
export class VentasModule { }
