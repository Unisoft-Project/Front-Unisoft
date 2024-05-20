import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { inventarioRoutes } from './inventario.routing';
import { VerInventarioComponent } from './ver-inventario/ver-inventario.component'; 


@NgModule({
  declarations: [
    VerInventarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(inventarioRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    NgxUiLoaderModule,
  ]
})
export class InventarioModule { }
