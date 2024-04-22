import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-compra',
  templateUrl: './agregar-compra.component.html'
})
export class AgregarCompraComponent {
  //Gestión Formulario Dispositivo
  selectedFormat: any = null;
  compraForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.compraForm = this.formBuilder.group({
      imei: ['', Validators.required],
      marcaTelefono: ['', Validators.required],
      procedencia: ['', Validators.required],
      modeloTelefono: ['', Validators.required],
      detallesTelefono: ['', Validators.required],
      valorCompra: ['', Validators.required]
    });
  }

  //Gestión Subida de Archivos
  onFormatSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFormat = event.target.files[0];
    }
  }

  onSubmitCompra() {
    if (this.compraForm.valid && this.selectedFormat) {
      const formData = new FormData();
      formData.append('formatoCompraVenta', this.selectedFormat);
      Object.keys(this.compraForm.value).forEach(key => {
        formData.append(key, this.compraForm.value[key]);
      });

      // Aquí puedes enviar los datos del formulario a tu servidor o servicio
      // Por ejemplo: this.miServicio.agregarCompra(formData);
    }
  }
  //Gestión Tabla
  displayedColumns: string[] = ['IMEI', 'Marca de Teléfono', 'Procedencia', 'Modelo del Teléfono', 'Detalles del Teléfono', 'Valor de Compra'];

  //Gestión Formulario Cliente (GET)
  onSubmiCliente() {
    if (this.compraForm.valid && this.selectedFormat) {
      const formData = new FormData();
      formData.append('formatoCompraVenta', this.selectedFormat);
      Object.keys(this.compraForm.value).forEach(key => {
        formData.append(key, this.compraForm.value[key]);
      });

      // Aquí puedes enviar los datos del formulario a tu servidor o servicio
      // Por ejemplo: this.miServicio.agregarCompra(formData);
    }
  }
}
