import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsComponent } from './order-details.component';
import { OrderItemEditorComponent } from './order-item-editor/order-item-editor.component';
import { MatCardModule} from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ItemsService } from '../items/items.service';
import { FakeServerService } from 'src/app/test/fake-server.service';
import { CustomersService } from '../customers/customers.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { OrdersService } from '../orders/orders.service';

@NgModule({
  declarations: [
    OrderDetailsComponent,
    OrderItemEditorComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatNativeDateModule, 
    MatMomentDateModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    OrderDetailsRoutingModule
  ],
  providers: [
    {provide: ItemsService, useFactory: (httpClient: HttpClient)=>{
        let service = new FakeServerService(httpClient);
        service.type = "items";
        return service;
      },deps:[HttpClient] },
    {provide: CustomersService, useFactory: (httpClient: HttpClient)=>{
      let service = new FakeServerService(httpClient);
      service.type = "customers";
      return service;
    },deps:[HttpClient] },
    {provide: OrdersService, useFactory: (httpClient: HttpClient)=>{
      let service = new FakeServerService(httpClient);
      service.type = "orders";
      return service;
    },deps:[HttpClient] }
  ]
})
export class OrderDetailsModule { }
