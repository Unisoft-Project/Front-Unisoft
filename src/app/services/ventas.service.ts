import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timeout } from 'rxjs';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  api_uri = 'https://back-unisoft-1.onrender.com';
  constructor(private http: HttpClient) {}

  logout(): void {}

  dataSource: Factura[] = [];

  private handleError(err: any): Observable<never> {
    let errorMessage = 'An error occured retrieving data';
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getAllVentas(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(
      'https://back-unisoft-1.onrender.com/ventas/ventas_realizadas',
      { headers: headers }
    );
  }

  addVenta(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `https://back-unisoft-1.onrender.com/ventas/nueva_venta`,
      data,
      { headers: headers }
    );
    
    
  }
}
