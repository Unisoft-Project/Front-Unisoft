import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './pages/authentication/login/auth.interceptor';


// Vertical Layout
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { BrandingComponent } from './layouts/full/sidebar/branding.component';
import { AppNavItemComponent } from './layouts/full/sidebar/nav-item/nav-item.component';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import { environment } from './environment/environment';
import {
  NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION, 
  NgxUiLoaderRouterModule, NgxUiLoaderHttpModule, NgxUiLoaderHttpConfig
} from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#1b1a5c",
  bgsOpacity: 0.5,
  bgsPosition: "top-right",
  bgsSize: 60,
  bgsType: "double-bounce",
  blur: 5,
  fgsColor: "#00D8FF",
  fgsPosition: "center-center",
  fgsSize: 60,
  fgsType: "square-jelly-box",
  gap: 24,
  logoPosition: "center-center",
  logoSize: 120,
  logoUrl: "",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbColor: "#2e41d6",
  pbDirection: "ltr",
  pbThickness: 3,
  text: "Cargando...",
  textColor: "#FFFFFF",
  textPosition:"center-center",
};



@NgModule({

  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    SidebarComponent,
    HeaderComponent,
    BrandingComponent,
    AppNavItemComponent,

  ],
  imports: [
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
               NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
               
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    HttpClientModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],


  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
