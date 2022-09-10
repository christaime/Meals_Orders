import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceService } from 'src/app/common/http-service.service';
import { Item } from 'src/app/model/items';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends HttpServiceService<Item>{

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  override getBaseUrl(): string {
    return this.getContextPath()+"/items";
  }

}