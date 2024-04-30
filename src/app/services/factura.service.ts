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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
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