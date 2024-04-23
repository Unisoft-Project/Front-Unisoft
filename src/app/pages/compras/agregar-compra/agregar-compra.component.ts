import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-agregar-compra',
  templateUrl: './agregar-compra.component.html'
})

export class AgregarCompraComponent {
  selectedFile: string | ArrayBuffer | null = null; // Adjust type to File | null
  firebaseFile: File | null = null;

  //* Gestión Formulario Compras (Entero)
  public compraForm = {
    imei: '',
    marca_telefono: '',
    procedencia: '',
    modelo_telefono: '',
    detalles: '',
    valor_compra: 0
  };


  async addCompra(form: any) {
    /*if (
      !form.value.imei ||
      !form.value.marca_telefono ||
      !form.value.procedencia ||
      !form.value.modelo_telefono ||
      !form.value.detalles ||
      !form.value.valor_compra
    ) {
      // Show Swal fire alert if any field is empty
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }*/
    }

  //* Subida de Formato CompraVenta
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
        this.firebaseFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteSelectedPhoto() {
    this.selectedFile = null;
  }

  //* Gestión Tabla
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['IMEI', 'Marca de Teléfono', 'Procedencia', 'Modelo del Teléfono', 'Detalles del Teléfono', 'Valor de Compra'];
  DATA: any[] = []

  addFila(form: any) {
    this.compraForm = form.value;
    const newData = this.DATA
    newData.push(this.compraForm);

    this.dataSource.data = [...newData];
    console.log('Formulario Captado:', this.compraForm);
    console.log('Data Source Cargado', this.dataSource.data);
  };

  //Gestión GET Cliente
  getCliente(){}
}
