import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceService } from 'src/app/common/http-service.service';
import { Customer } from 'src/app/model/customer';
import { Persistable } from 'src/app/model/persistable';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends HttpServiceService<Customer>{

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  override getBaseUrl(): string {
    return this.getContextPath()+"/customers";
  }
}
