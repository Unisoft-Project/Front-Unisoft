import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timeout } from 'rxjs';
import { Factura } from '../models/factura.model';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  api_uri = 'https://back-unisoft-1.onrender.com'
  constructor(private http: HttpClient) { }

  

  logout():void{}
  private readToken():void{}
  private saveToken():void{}
  dataSource: Factura[] = [];

  private handleError(err: any): Observable<never>{
    let errorMessage = 'An error occured retrieving data';
    if(err){
      errorMessage = `Error: code ${err.message}`;

    }
    window.alert(errorMessage)
    return throwError(errorMessage)

  }


  getFactura(id: any): Observable<any>{
    console.log(id)
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
     return this.http.get<any[]>(
      "https://back-unisoft-1.onrender.com/factura/factura_inversion/oid/" + id,
      { headers: headers }
    )
   
  }

 
}