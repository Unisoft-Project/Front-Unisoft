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
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';
import { VerClientesComponent } from './ver-clientes/ver-clientes.component';
import { NgxUiLoaderModule } from  'ngx-ui-loader';


@NgModule({
  declarations: [
    AgregarClienteComponent,
    EditarClienteComponent,
    VerClientesComponent
    
  ],
  imports: [
    NgxUiLoaderModule,
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
