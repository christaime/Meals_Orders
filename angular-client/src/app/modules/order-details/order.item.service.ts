import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceService } from 'src/app/common/http-service.service';
import { OrderItem } from 'src/app/model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends HttpServiceService<OrderItem>{

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  override getBaseUrl(): string {
    return this.getContextPath()+"/order/item";
  }
}
