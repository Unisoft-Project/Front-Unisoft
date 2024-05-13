import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EmailJSResponseStatus } from '@emailjs/browser';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../../../models/productos.interface';

import { FacturaService } from 'src/app/services/factura.service';
import { Factura } from 'src/app/models/factura.model';
import { VentaItem } from 'src/app/models/venta.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { VentasService } from 'src/app/services/ventas.service';


interface TableData {
  IMEI: string;
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
  valorDispositivo: number | null = null;
  loading: boolean = false;
  totalVenta: number = 0;
  mostrarModalProductos = false
  productoEncontrado: Producto;
  imeiField: any;
  productoFoundTag = false;
  valorventafield: any;
  constructor(
    private fireStorage: AngularFireStorage,
    private http: HttpClient,
    private facturaService: FacturaService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private ventasService: VentasService,

  ) { }
  dataSource: Producto[] = [];
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
  tipo_doc: any = ''

  displayedColumns: string[] = ['imei', 'descripcion_marca_dispositivo', 'modelos', 'valor_compra', 'valorVenta'];


  //Gestión GET Cliente
  getCliente(documento: string) {
    this.ngxService.start();
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
        this.ngxService.stop();
        this.clientFound = response[0];
        this.doc = documento;
        this.clientFoundTag = true;
        this.clienteEncontrado.documento = response[0].documento;
        this.clienteEncontrado.nombre = response[0].nombre;
        this.clienteEncontrado.direccion = response[0].direccion;
        this.clienteEncontrado.telefono = response[0].telefono;
      }, (error) => {
        this.ngxService.stop();
        if (error.status === 404) {
          Swal.fire({
            title: 'Cliente no encontrado',
            text: 'El cliente no existe en la base de datos.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al procesar la solicitud.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );
  }

  generarFactura(codFactura: any) {
    this.facturaService
      .getFactura(codFactura)
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
          setTimeout(() => {
            this.router.navigate(['/ventas/ver-ventas']);
          }, 2000); // 2000 milisegundos = 2 segundos
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
      '/assets/images/smartphone-call.jpeg',
      'PNG',
      margins.left,
      10,
      20,
      20
    );
    doc.setFontSize(9);
    // Add header text
    doc.text(info[0].usuario.empresa, 40, 15);
    doc.text('NIT:' + ' ' + info[0].usuario.nit, 40, 20);
    doc.text('CELULAR:' + ' ' + info[0].cliente.telefono, 40, 25);
    doc.text('No Responsable de IVA', 40, 30);
    doc.text(info[0].fecha_hora, 170, 15);
    doc.text('Factura No.' + ' ' + info[0].numero_factura, 170, 20);

    // Add customer information
    this.addCustomerInfo(doc, margins, info);
    this.addDispositivosInfo(doc, margins, compras);
    doc.save('Factura' + info[0].numero_factura + '.pdf');

    //agregar a firebase
    return doc;
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
    console.log(factura[0])
    const infoTexts = [
      { label: 'INFORMACIÓN DEL CLIENTE', yPos: 45 },
      { label: 'NOMBRE:', value: factura[0].cliente.nombre, yPos: 55 },
      {
        label: 'TIPO DE DOCUMENTO:',
        value: factura[0].cliente.tipo_documento.descripcion,
        yPos: 60,
      },
      {
        label: 'NÚMERO DE CÉDULA:',
        value: factura[0].cliente.documento,
        yPos: 65,
      },
      { label: 'DIRECCIÓN:', value: factura[0].cliente.direccion, yPos: 70 },
      { label: 'TELÉFONO:', value: factura[0].cliente.telefono, yPos: 75 },
      { label: 'DETALLES DE COMPRA:', yPos: 90 },
    ];

    infoTexts.forEach((info) => {
      if (info.label === 'INFORMACIÓN DEL CLIENTE' || info.label === 'DETALLES DE COMPRA:') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
      } else {
        doc.setFontSize(9)
      }
      // Set font style to bold
      doc.setFont('helvetica', 'bold');
      doc.text(info.label, margins.left, info.yPos);

      // Reset font style to normal
      doc.setFont('helvetica', 'normal');
      if (info.value) {
        doc.text(info.value, margins.left + 70, info.yPos);
      }
    });
  }
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
    ];

    let yPos = 100;
    let valorTotal = 0;

    // Add table headers
    headers.forEach((header, index) => {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold');
      doc.text(header, margins.left + index * 30, yPos);

    });

    // Increment y position for data rows
    doc.setFont('helvetica', 'normal');

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
      .map((text, index) => ` ${text}`)
      .join(' ');

    // Split text into array of lines based on specified width
    const lines = doc.splitTextToSize(concatenatedText, 250); // Adjust width as needed

    // Add warranty information to PDF
    lines.forEach((line: any, index: any) => {
      doc.setFontSize(7);
      doc.text(line, margins.left, yPos + 50 + index * 3);
    });
  }

  limpiarCamposAgregarProductos() {
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
    this.imeiField = "";
    this.productoFoundTag = false;
    this.valorventafield = 0;
  }

  cerrarModalAgregarProductos() {
    this.mostrarModalProductos = false;
    this.limpiarCamposAgregarProductos();
  }

  validaProductoLista(productoBuscado: Producto) {
    const imeiBuscado = productoBuscado.imei;
    const existeIMEI = this.dataSource.some(producto => producto.imei === imeiBuscado);
    return existeIMEI;
  }

  agregarProductosLista(producto: Producto) {
    if (producto === undefined) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Primero debe ingresar un dispositivo',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
    else {
      if (!this.validaProductoLista(producto)) {
        producto.valor_venta = this.valorventafield;
        console.log('valorVentaSinMoneda', this.totalVenta);
        console.log('producto.valor_venta', producto.valor_venta);
        const ventaTotal: number = producto.valor_venta + this.totalVenta;
        console.log('ventaTotal', ventaTotal);
        this.totalVenta = ventaTotal;
        this.dataSource = [...this.dataSource, producto];
        this.mostrarModalProductos = false;
        this.limpiarCamposAgregarProductos();
      } else {
        Swal.fire({
          title: 'Advertencia',
          text: 'El producto ya se encuentra agregado a la venta.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  }

  getProducto(imei: string) {
    this.ngxService.start();
    const token = localStorage.getItem('token');
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
        this.productoEncontrado = response;
        this.productoFoundTag = true
        this.ngxService.stop();
      }, (error) => {
        console.error(error);
        this.ngxService.stop();
        Swal.fire({
          title: 'Advertencia',
          text: 'Dispositivo no disponible.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  onValueChange() {
  }

  formatCurrency(event: any): void {
    const inputValue: string = event.target.value;

    // Eliminar todos los caracteres que no sean números
    const numericValue: string = inputValue.replace(/[^0-9]/g, '');

    // Convertir el valor a número
    this.valorDispositivo = parseFloat(numericValue);

    // Formatear el valor como pesos colombianos (COP)
    event.target.value = this.valorDispositivo.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  }

  async addVenta(form: any) {
    this.ngxService.start();
    const data: any = {};
    if (
      !form.value.numeroFactura ||
      !form.value.metodoPago ||
      !form.value.fechaFactura
    ) {
      this.ngxService.stop();
      Swal.fire({
        title: 'Debe rellenar todos los campos',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    } else {

      data.usuario = 1  //Toca añadir que sea el usuario de la sesión
      data.numero_factura = form.value.numeroFactura;
      data.fecha_hora = form.value.fechaFactura;
      data.cliente = this.clientFound.oid
      data.total_venta = this.totalVenta;
      console.log(data)
      this.ventasService.addVenta(data).pipe(
        timeout(200000)
      ).subscribe(
        (response) => {
          //this.generarFactura(form.value.numeroFactura)
          console.log(response)
          this.ngxService.stop();
          Swal.fire({
            title: 'Venta registrada con éxito',
            text: '',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.generarFactura(form.value.numeroFactura)
            }
          });
        },
        (error) => {
          console.log(error);
          this.ngxService.stop();
          if (error.status === 400) {
            Swal.fire({
              title: 'Error al registrar venta',
              text: 'El número de la factura ya está registrado. Por favor, intente con otro número.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else if (error.status === 404) {
            this.ngxService.stop();
            Swal.fire({
              title: 'Error al registrar venta',
              text: 'El número de la factura ya está registrado. Por favor, intente con otro número.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            this.ngxService.stop();
            Swal.fire({
              title: 'Error',
              text: 'Error al agregar la venta. Por favor, inténtelo nuevamente más tarde.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      );
    }
  }
}
