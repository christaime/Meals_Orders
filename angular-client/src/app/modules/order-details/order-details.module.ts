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
    OrderDetailsRoutingModule
  ],
  providers: [
    {provide: ItemsService, useClass: FakeServerService},
    {provide: CustomersService, useClass: FakeServerService}
  ]
})
export class OrderDetailsModule { }
