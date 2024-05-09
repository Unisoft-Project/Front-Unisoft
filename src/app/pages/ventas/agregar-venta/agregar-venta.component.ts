import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EmailJSResponseStatus } from '@emailjs/browser';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaService } from 'src/app/services/factura.service';
import { Factura } from 'src/app/models/factura.model';
import { VentaItem } from 'src/app/models/venta.model';
import { Producto } from './interfaces/productos.interface';


interface TableData {
  imei: string;
  marcaTelefonos: string;
  observacion: string;
  modeloTelefonos: string;
  valorVenta: number;
}

@Component({
  selector: 'app-agregar-venta',
  templateUrl: './agregar-venta.component.html',
  styleUrls: ['./agregar-venta.component.css']
})

export class AgregarVentaComponent {
  documentoField: any;
  clientFoundTag: boolean = false;
  clientFound: any;
  loading: boolean = false;
  totalVenta: number = 0;
  productoFoundTag=false;
  imeiField: any;
  valorventafield:any;
  constructor(
    private fireStorage: AngularFireStorage,
    private http: HttpClient,
    private facturaService: FacturaService
  ) { }
  dataSource: Factura[] = [];
  factura: Factura[] = [];
  info_factura: any[] = [];
  info_compras: any[] = [];
  numero_factura: any
  //* Estructura para Busqueda Cliente
  doc = '';
  public clienteEncontrado = {
    nombre: '',
    tipo_documento: '',
    documento: '',
    direccion: '',
    telefono: '',
    correo: ''
  };
  productoEncontrado: Producto;
  mostrarModalProductos=false

  calcularTotal(): number {
    return this.tableData.reduce((total, item) => total + item.valor_venta, 0);
  }


  tableData: Producto[] = [];
  limpiarCamposAgregarProductos(){
    const productoVacio: Producto = {
      imei: "",
      valor_compra: "",
      modelos: "",
      descripcion_marca_dispositivo: "",
      oid: 0,
      fecha_hora: "",
      valor_venta: 0
    };
    this.productoEncontrado = productoVacio;
    this.imeiField="";
    this.productoFoundTag=false;
    this.valorventafield=0;
  }

  validaProductoLista(productoBuscado : Producto){
    const imeiBuscado = productoBuscado.imei;
    const existeIMEI = this.dataSource.some(producto => producto.imei === imeiBuscado);
    return existeIMEI;
  }

  agregarProductosLista(producto:Producto){
    if(producto===undefined){
      Swal.fire({
        title: 'Advertencia',
        text: 'Primero debe ingresar un dispositivo',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
    else{
      if(!this.validaProductoLista(producto)){
        producto.valor_venta=this.valorventafield
        this.dataSource = [...this.dataSource, producto];
        this.mostrarModalProductos=false;
        this.limpiarCamposAgregarProductos();
        this.calcularTotal();
      }else{
      Swal.fire({
        title: 'Advertencia',
        text: 'El producto ya se encuentra agregado a la venta.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });}
    }

  }
  cerrarModalAgregarProductos(){
    this.mostrarModalProductos=false;
    this.limpiarCamposAgregarProductos();
  }


  dataSource: Producto[] = [];

  displayedColumns: string[] = ['imei', 'descripcion_marca_dispositivo', 'modelos', 'valor_compra', 'valorVenta'];

  getProducto(imei: string) {
    this.loading = true;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzMTQxOTQ0MDIsIm9pZCI6MTkyLCJub21icmUiOiJ2IiwiYXBlbGxpZG8iOiJiIiwiZW1wcmVzYSI6ImIiLCJ0aXBvX2RvY3VtZW50b19vaWQiOjEsIm5yb19kb2N1bWVudG8iOiIxIiwibml0IjoiMSIsInJhem9uX3NvY2lhbCI6IjEiLCJkaXJlY2Npb24iOiIxIiwidGVsZWZvbm8iOiIxIiwiZmlybWEiOiIxIiwiY2l1ZGFkX29pZCI6MSwiZW1haWwiOiJiQGdtYWlsLmNvIn0.zxsR-QVTTVfY9CVRTzS9h1cbN-QfU0Nen_yk15gAW2s';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const endpoint = `https://back-unisoft-1.onrender.com/compra/compra-inventario_imei/${imei}`;
     // http://localhost:8000/
    this.http.get<Producto>(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: Producto) => {
        this.productoEncontrado=response;
        this.productoFoundTag=true
        this.loading = false;
      }, (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          title: 'Advertencia',
          text: 'Dispositivo no disponible.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }


  //Gestión GET Cliente
  getCliente(documento: string) {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const endpoint = `https://back-unisoft-1.onrender.com/cliente/listaClientes/documento/${documento}`;

    this.http.get(endpoint, { headers: headers }).pipe(
      timeout(200000)
    ).subscribe(
      (response: any) => {
        // Handle the response here
        this.clientFound = response[0];
        this.doc = documento;
        this.clientFoundTag = true;
        console.log('response', response);
        this.clienteEncontrado.documento = response[0].documento;
        this.clienteEncontrado.nombre = response[0].nombre;
        this.clienteEncontrado.direccion = response[0].direccion;
        this.clienteEncontrado.telefono = response[0].telefono;
        this.clienteEncontrado.correo = response[0].correo;
      }, (error) => {
        // Handle errors here
        console.error(error);
        Swal.fire({
          title: 'Advertencia',
          text: 'Cliente no encontrado',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  generarFactura(num_factura: any) {
    this.facturaService
      .getFactura(num_factura)
      .pipe(timeout(200000))
      .subscribe(
        (res) => {
          this.factura = res;
          this.info_factura = [this.factura[0]]; // Wrap the single object in an array
          this.info_compras = [this.factura[1]];
          console.log(this.info_compras[0]);
          const doc = this.generatePDF(this.info_factura, this.info_compras); // Call generatePDF to get the PDF document
          const file: File = new File([doc.output('blob')], 'factura.pdf', {
            type: 'application/pdf',
          });
          this.addFirebase(file, this.info_factura[0].numero_factura);
        },
        (err) => console.log(err)
      );
  }
  generatePDF(info: any[], compras: any[]) {
    
    const margins = {
      top: 30,
      bottom: 30,
      left: 10,
      right: 10,
    };

    const doc = new jsPDF();

    // Add header image
    doc.addImage(
      '/assets/images/smartphone-call.png',
      'PNG',
      margins.left,
      10,
      20,
      20
    );
    doc.setFontSize(9);
    // Add header text
    doc.text(info[0].usuario.empresa, 30, 15);
    doc.text('NIT:' + ' ' + info[0].usuario.nit, 30, 20);
    doc.text('CELULAR:' + ' ' + info[0].cliente.telefono, 30, 25);
    doc.text('No Responsable de IVA', 30, 30);
    doc.text(info[0].fecha_hora, 170, 15);
    doc.text('Factura No.' + ' ' + info[0].numero_factura, 170, 20);

    // Add customer information
    this.addCustomerInfo(doc, margins, info);
    this.addDispositivosInfo(doc, margins, compras);
    doc.save('Factura' + info[0].numero_factura + '.pdf');

    //agregar a firebase
    return doc;
  }

  guardarPDF() {
    //const doc = this.generatePDF(); // Call generatePDF to get the PDF document
   // const file: File = new File([doc.output('blob')], 'factura.pdf', { type: 'application/pdf' });
    // Now you have a File object representing the PDF document
    // You can use this file object for further processing or upload
   // this.addFirebase(file, 1234)

  }


  async addFirebase(doc: any, factura: any) {
    const file: File = doc as File;
    const path = `facturas-ventas/${factura}`;
    const storageRef = this.fireStorage.ref(path);

    // Specify content type based on file extension
    const contentType = this.getContentType(file.name);

    try {
      // Upload the file to Firebase Storage
      const uploadTask = storageRef.put(file, { contentType });

      // Get the download URL once the upload is complete
      uploadTask.then(async (snapshot) => {
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log('File uploaded successfully. Download URL:', downloadURL);
        this.send(downloadURL);
        // You can use the downloadURL as needed, e.g., save it to a database
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async send(link: String) {
    emailjs.init('Hul6hhwwkEGu_XFbm');

    let response = await emailjs.send('service_25tuaru', 'template_mdisrb1', {
      from_name: 'Danicell',
      to_name: 'test',
      to_email: this.clienteEncontrado.correo,
      subject: 'Test subject',
      message: 'this is message',
      link: link,
    });
    console.log('mensaje enviado');
  }




  getContentType(fileName: string): string {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      // Add more cases for other file types as needed
      default:
        return 'application/octet-stream'; // Default content type
    }
  }

  private addCustomerInfo(doc: jsPDF, margins: any, factura: any[]) {
    // Add customer information
    const infoTexts = [
      { label: 'Información del Cliente', yPos: 45 },
      { label: 'Nombre:', value: factura[0].nombre, yPos: 55 },
      {
        label: 'Tipo De Documento:',
        value: factura[0].cliente.tipo_documento.descripcion,
        yPos: 60,
      },
      {
        label: 'Número de Cédula:',
        value: factura[0].cliente.documento,
        yPos: 65,
      },
      { label: 'Dirección:', value: factura[0].cliente.direccion, yPos: 70 },
      { label: 'Teléfono:', value: factura[0].cliente.telefono, yPos: 75 },
      { label: 'Detalles de compra:', yPos: 85 },
    ];

    infoTexts.forEach((info) => {
      doc.text(info.label, margins.left, info.yPos);
      if (info.value) {
        doc.text(info.value, margins.left + 70, info.yPos);
      }
    });
  }
<<<<<<< HEAD
  venta: VentaItem[] = [];
  private addDispositivosInfo(doc: jsPDF, margins: any, info: any) {
    // Define table headers
    const headers = [
      'IMEI',
      'MARCA',
      'MODELO',
      'PROCEDENCIA',
      'GARANTÍA',
      'PRECIO UNITARIO',
      'SUBTOTAL',
=======


  private addDispositivosInfo(doc: jsPDF, margins: any) {
    // Define table headers
    const headers = ['IMEI', 'MARCA', 'MODELO', 'PRECIO UNITARIO', 'SUBTOTAL'];

    // Define table data
    const dispositivosData = [
      { imei: '123456789', marca: 'Apple', modelo: 'iPhone 15 Pro', procedencia: 'Nuevo', garantia: '1 año', precio_unitario: '4.000.000', subtotal: '4.000.000' },
      { imei: '738236663', marca: 'Apple', modelo: 'iPhone 15 Pro Max', procedencia: 'Usado', garantia: '1 año', precio_unitario: '5.000.000', subtotal: '5.000.000' },
      { imei: '738236663', marca: 'Apple', modelo: 'iPhone 15 Pro Max', procedencia: 'Usado', garantia: '1 año', precio_unitario: '5.000.000', subtotal: '5.000.000' },
      { imei: '738236663', marca: 'Apple', modelo: 'iPhone 15 Pro Max', procedencia: 'Usado', garantia: '1 año', precio_unitario: '5.000.000', subtotal: '5.000.000' },
      { imei: '738236663', marca: 'Apple', modelo: 'iPhone 15 Pro Max', procedencia: 'Usado', garantia: '1 año', precio_unitario: '5.000.000', subtotal: '5.000.000' },
      { imei: '738236663', marca: 'Apple', modelo: 'iPhone 15 Pro Max', procedencia: 'Usado', garantia: '1 año', precio_unitario: '5.000.000', subtotal: '5.000.000' },
      { imei: '738236663', marca: 'Apple', modelo: 'iPhone 15 Pro Max', procedencia: 'Usado', garantia: '1 año', precio_unitario: '5.000.000', subtotal: '5.000.000' },

      // Add more data as needed
      // Add more data as needed
>>>>>>> HU-20
    ];

    let yPos = 95;
    let valorTotal = 0;

    // Add table headers
    headers.forEach((header, index) => {
      doc.text(header, margins.left + index * 30, yPos);
    });

    // Increment y position for data rows
    yPos += 10;
    info = info[0]
    info.forEach((item: any) => {
      doc.text(item.compra_inventario.imei, margins.left, yPos);
      doc.text(
        item.compra_inventario.marca_dispositivo.descripcion_marca_dispositivo,
        margins.left + 30,
        yPos
      );
      doc.text(item.compra_inventario.modelo_dispositivo.modelos, margins.left + 60, yPos);
      doc.text(item.observacion, margins.left + 90, yPos);
      doc.text(item.garantia, margins.left + 120, yPos);
      
      doc.text(item.precio_unitario.toString(), margins.left + 150, yPos);
      doc.text(item.subtotal.toString(), margins.left + 180, yPos);
      valorTotal += item.subtotal;
      yPos += 5; // Increment y position for next row
    });
    

    // Calculate total

     doc.text('Total', margins.left + 150, yPos + 10);
     doc.text(valorTotal.toString(), margins.left + 180, yPos + 10);

    const warrantyText = [
      '1.-Garantía de IMEI de por vida.',
      '2.-Garantía por funcionamiento 2 meses.',
      '3.-La garantía no cubre daños por maltrato, golpes, humedad, display, táctil, sobrecarga o equipos apagados.',
      '4.-La garantía no cubre modificación de software mal instalado por el cliente, que se dañe el software',
      '5.-Sin factura no hay garantía. 6.- Si el daño no está dentro de la garantía debe cancelarse el costo de la revisión y/o arreglo. 7.- Si el equipo entra por garantía, debe contar con un tiempo de revisión y entrega',
    ];
    const concatenatedText = warrantyText
      .map((text, index) => `${text}`)
      .join(' ');

    // Split text into array of lines based on specified width
    const lines = doc.splitTextToSize(concatenatedText, 250); // Adjust width as needed

    // Add warranty information to PDF
    lines.forEach((line: any, index: any) => {
      doc.setFontSize(7);
      doc.text(line, margins.left, yPos + 50 + index * 3);
    });
  }
}
