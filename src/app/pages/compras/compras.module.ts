import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AgregarCompraComponent } from './agregar-compra/agregar-compra.component';
import { comprasRoutes } from './compras.routing';
import { VerCompraComponent } from './ver-compra/ver-compra.component';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { EditarCompraComponent } from './editar-compra/editar-compra.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AgregarCompraComponent,
    VerCompraComponent, 
    EditarCompraComponent
  ],
  imports: [
    MatTableModule,
    NgxUiLoaderModule,
    CommonModule,
    RouterModule.forChild(comprasRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ]
})
export class ComprasModule { }
