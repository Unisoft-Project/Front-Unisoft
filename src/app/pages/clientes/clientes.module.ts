import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgregarClienteComponent } from './agregar-cliente/agregar-cliente.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { clientesRoutes } from './clientes.routing';



@NgModule({
  declarations: [
    AgregarClienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(clientesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ]
})
export class ClientesModule { }
