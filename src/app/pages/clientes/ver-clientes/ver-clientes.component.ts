import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,

} from 'ng-apexcharts';






interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}

export interface productsData {
  id: number;
  tipo_documento: string;
  documento: string;
  nombre: string;
  direccion: string;
  telefono: string;
  foto_documento: string;
}



const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    tipo_documento: "CC",
    documento: "123456789",
    nombre: "Jeon Jungkook",
    direccion: "cl 57 #25-69",
    telefono: "987654321",
    foto_documento: 'assets/images/profile/user-1.jpg'   
  },
  {
    id: 2,
    tipo_documento: "CC",
    documento: "123456789",
    nombre: "Kim Taehyung",
    direccion: "cl 57 #25-69",
    telefono: "987654321",
    foto_documento: 'assets/images/profile/user-2.jpg'   
  },
  {
    id: 3,
    tipo_documento: "CC",
    documento: "123456789",
    nombre: "Valentina Barbetty",
    direccion: "cl 57 #25-69",
    telefono: "987654321",
    foto_documento: 'assets/images/profile/user-3.jpg'   
  },
  {
    id: 4,
    tipo_documento: "CC",
    documento: "123456789",
    nombre: "Jin",
    direccion: "cl 57 #25-69",
    telefono: "987654321",
    foto_documento: 'assets/images/profile/user-4.jpg'   
  },
];

@Component({
  selector: 'app-ver-clientes',
  templateUrl: './ver-clientes.component.html'
})
export class VerClientesComponent {



  displayedColumns: string[] = ['Id', 'TipoDocumento', 'Documento', 'Nombre', 'Direccion', 'Telefono', 'FotoDocumento'];
  dataSource = ELEMENT_DATA;


  constructor() {
    // sales overview chart
  
}
}
