import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServiceService } from '../common/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class FakeServerService extends HttpServiceService<any>{

  autoIncrement = 0;
  customers: any[] = [];

  constructor(httpClient:HttpClient) { 
    super(httpClient);
    console.log("FakeServerService",this);
  }

  override save(data: any): Observable<any> {
    console.log("save",this.getSaveUrl(),data);
    if(this.getSaveUrl().indexOf("customers") != -1){
      data.id = ++this.autoIncrement +'';
      this.customers.push(data);
      return of(data);
    }
    return of(true);
  }
}
