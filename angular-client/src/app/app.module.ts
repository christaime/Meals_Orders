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
registerLocaleData(frLocale);
registerLocaleData(enLocale);

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
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
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
