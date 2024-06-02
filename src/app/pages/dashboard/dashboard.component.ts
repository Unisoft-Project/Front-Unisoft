import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';

interface month {
  value: string;
  viewValue: string;
}

export interface salesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

export interface monthlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}


export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  productName: string;
  budget: number;
  priority: string;
}

// ecommerce card
interface productcards {
  id: number;
  imgSrc: string;
  title: string;
  price: string;
  rprice: string;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent {


  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public salesOverviewChart!: Partial<salesOverviewChart> | any;
  public yearlyChart!: Partial<yearlyChart> | any;
  public monthlyChart!: Partial<monthlyChart> | any;
  public dailySalesChart!: Partial<yearlyChart> | any;


  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
  

  months: month[] = [
    { value: 'mar', viewValue: 'Marzo 2024' },
    { value: 'apr', viewValue: 'Abril 2024' },
    { value: 'june', viewValue: 'Mayo 2024' },
  ];


  // ecommerce card

  stockActual: number = 0;
  getDevices() {
    const token = localStorage.getItem('token');    ;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    //
    this.http.get<any[]>(
      `https://back-unisoft-1.onrender.com/compra/dispositivos_disponibles/?imei=&marca_dispositivo=&modelo_dispositivo=`,
      { headers: headers }
    ).pipe(
      timeout(200000)
    ).subscribe(
      (response) => {
        this.stockActual = response.length
      },
      (error) => {
        return 0
      }
    );
  }
  
  //inversion of variables
  totalInversion: number = 0;
  years: number[] = [];
  porcentajes: string[] = [];
  primeroPorcentaje: string = '0';
  segundoPorcentaje: string = '0';
  datosAmostrar: any[] = [];
  //ventas variables
  ventasHoy: number = 0;

  constructor(private ngxService: NgxUiLoaderService, private http: HttpClient,) {
    this.getInversionesDashboard();
    this.getDevices();
    this.getDailySales();
    
    // sales overview chart
    this.salesOverviewChart = {
      series: [
        {
          name: 'Eanings this month',
          data: [355, 390, 300, 350, 390, 180, 355, 390],
          color: '#5D87FF',
        },
        {
          name: 'Expense this month',
          data: [280, 250, 325, 215, 250, 310, 280, 250],
          color: '#49BEFF',
        },
      ],

      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
      },
      chart: {
        type: 'bar',
        height: 390,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: 'category',
        categories: [
          '16/08',
          '17/08',
          '18/08',
          '19/08',
          '20/08',
          '21/08',
          '22/08',
          '23/08',
        ],
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 400,
        tickAmount: 4,
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: 'butt',
        colors: ['transparent'],
      },
      tooltip: { theme: 'light' },

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    };

    // Brian Gomez
    this.yearlyChart = {
      series: [10, 20, 30, 40],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 130,
      },
      colors: ['#4c6ca8', '#6f89b9', '#b7c4dc', '#5D87FF'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '75%',
            background: 'transparent',
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };

    // mohtly earnings chart
    this.monthlyChart = {
      series: [
        {
          name: '',
          color: '#49BEFF',
          data: [25, 66, 20, 40, 12, 58, 20],
        },
      ],

      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#E8F7FF'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }



  getInversionesDashboard() {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    //
    this.http.get<any[]>(
     `https://back-unisoft-1.onrender.com/dashboard/inversiones`,
      { headers: headers }
    ).pipe(
      timeout(200000)
    ).subscribe(
      (response) => {
        this.ngxService.stop();
        this.totalInversion = response.reduce((inversion, item) => inversion + item.inversion, 0);
        this.years = response.map(item => item.ano_de_inversion);
        for (let i = 0; i < response.length; i++) {
          const porcentaje = (response[i].inversion / response[i].total) * 100;
          let primerosDosDigitos = Math.floor(porcentaje).toString().substring(0, 2);
          this.porcentajes.push(primerosDosDigitos);
        }
        this.datosAmostrar = this.porcentajes.map(Number)
        this.primeroPorcentaje = this.porcentajes[0];
        this.segundoPorcentaje = this.porcentajes[1];
      },
      (error) => {
        this.ngxService.stop();
        console.log('Error a la consultar datos de la dashboard.');
      }
    );
  }

  getDailySales() {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any>(
      `https://back-unisoft-1.onrender.com/ventas/ventas_hoy`,
      { headers: headers }
    ).pipe(
      timeout(200000)
    ).subscribe(
      (response) => {
        this.ngxService.stop();
        this.ventasHoy = response.cantidad_ventas; // Asignar el valor correcto desde la respuesta
      },
      (error) => {
        this.ngxService.stop();
        console.log('Error al consultar datos de ventas diarias.');
      }
    );
  }
}
