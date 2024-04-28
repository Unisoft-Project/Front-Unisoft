import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-agregar-venta',
  templateUrl: './agregar-venta.component.html'
})
export class AgregarVentaComponent {

  constructor() {}

  generatePDF() {
    const margins = {
      top: 30, 
      bottom: 30, 
      left: 10, 
      right: 10
    };

    const doc = new jsPDF();
    
    // Add header image
    doc.addImage(
      "/assets/images/smartphone-call.png",
      "PNG",
      margins.left, 
      10,
      20,
      20
    );
    doc.setFontSize(9);
    // Add header text
    doc.text('DANICELL', 30, 15);
    doc.text('NIT 1.006.048.770', 30, 20);
    doc.text('CELULAR: 3178176300', 30, 25);
    doc.text('No Responsable de IVA', 30, 30);
    doc.text('01/01/2024', 170, 15);
    doc.text('Factura No. 343536', 170, 20);

    // Add customer information
    this.addCustomerInfo(doc, margins);
    this.addDispositivosInfo(doc, margins);
    doc.save('Factura_343536.pdf');

  }

  private addCustomerInfo(doc: jsPDF, margins: any) {
    // Add customer information
    const infoTexts = [
      { label: 'Información del Cliente', yPos: 45 },
      { label: 'Nombre:', value: 'Valentina', yPos: 55 },
      { label: 'Tipo De Documento:', value: 'Cédula de Ciudadanía', yPos: 60 },
      { label: 'Número de Cédula:', value: '123456789', yPos: 65 },
      { label: 'Dirección:', value: 'Cl 7', yPos: 70 },
      { label: 'Teléfono:', value: '987654321', yPos: 75 },
      { label: 'Detalles de compra:', yPos: 85 },
     
    ];

    infoTexts.forEach(info => {
      doc.text(info.label, margins.left, info.yPos);
      if (info.value) {
        doc.text(info.value, margins.left + 70, info.yPos);
      }
    });
  }
  private addDispositivosInfo(doc: jsPDF, margins: any) {
    // Define table headers
    const headers = ['IMEI', 'MARCA', 'MODELO', 'PROCEDENCIA', 'GARANTÍA', 'PRECIO UNITARIO', 'SUBTOTAL'];

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
    ];


    // Set initial y position for the table
    let yPos = 95;

    // Add table headers
    headers.forEach((header, index) => {
      doc.text(header, margins.left + (index * 30), yPos);
    });

    // Increment y position for data rows
    yPos += 10;

    // Add table data
    dispositivosData.forEach(data => {
      doc.text(data.imei, margins.left, yPos);
      doc.text(data.marca, margins.left + 30, yPos);
      doc.text(data.modelo, margins.left + 60, yPos);
      doc.text(data.procedencia, margins.left + 90, yPos);
      doc.text(data.garantia, margins.left + 120, yPos);
      doc.text(data.precio_unitario, margins.left + 150, yPos);
      doc.text(data.subtotal, margins.left + 180, yPos);

      yPos += 5; // Increment y position for next row
    });

    doc.text('Total', margins.left + 180, yPos + 10)
    doc.text('14.000.000', margins.left + 180, yPos + 15)

    const warrantyText = [
      '1.-Garantía de IMEI de por vida.',
      '2.-Garantía por funcionamiento 2 meses.',
      '3.-La garantía no cubre daños por maltrato, golpes, humedad, display, táctil, sobrecarga o equipos apagados.',
      '4.-La garantía no cubre modificación de software mal instalado por el cliente, que se dañe el software',
      '5.-Sin factura no hay garantía. 6.- Si el daño no está dentro de la garantía debe cancelarse el costo de la revisión y/o arreglo. 7.- Si el equipo entra por garantía, debe contar con un tiempo de revisión y entrega'
    ];
    const concatenatedText = warrantyText.map((text, index) => `${text}`).join(' ');
    
    // Split text into array of lines based on specified width
    const lines = doc.splitTextToSize(concatenatedText, 250); // Adjust width as needed
    
    // Add warranty information to PDF
    lines.forEach((line: any, index: any) => {
      doc.setFontSize(7)
      doc.text(line, margins.left, yPos + 50 + index * 3);
    });
  }
}
