import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { registerLocaleData } from '@angular/common';
import frLocale from '@angular/common/locales/fr';
import enLocale from '@angular/common/locales/en';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FullscreenOverlayContainer, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { LoaderComponent } from './common/loader/loader.component';
import { ChoicesDialogComponent } from './common/choices-dialog/choices-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomersService } from './modules/customers/customers.service';
import { FakeServerService } from './test/fake-server.service';

registerLocaleData(frLocale);
registerLocaleData(enLocale);

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    FooterComponent,
    HomeComponent,
    LoaderComponent,
    ChoicesDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    OverlayModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
         provide: TranslateLoader,
         useFactory: (httpClient:HttpClient)=>{
           return new TranslateHttpLoader(httpClient,"./assets/i18n/",".json");
         },
         deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3600,verticalPosition:"top"}},
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},

    /*{provide: CustomersService, useFactory: (httpClient: HttpClient)=>{
      let service = new FakeServerService(httpClient);
      service.type = "customers";
      return service;
    },deps:[HttpClient] },
    {provide: ItemsService, useFactory: (httpClient: HttpClient)=>{
      let service = new FakeServerService(httpClient);
      service.type = "items";
      return service;
    },deps:[HttpClient] },
    {provide: OrderItemService, useFactory: (httpClient: HttpClient)=>{
        let service = new FakeServerService(httpClient);
        service.type = "order-items";
        return service;
    },deps:[HttpClient] },
    {provide: OrdersService, useFactory: (httpClient: HttpClient)=>{
      let service = new FakeServerService(httpClient);
      service.type = "orders";
      return service;
    },deps:[HttpClient] }
    */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
