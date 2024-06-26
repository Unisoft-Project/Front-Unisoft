import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Modernize Angular Admin Tempplate';
  showLoader: boolean = false; // Cambiado a false para ocultar el loader inicialmente

  hideLoader() {
    this.showLoader = false;
  }
}
