import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServiceService } from '../common/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class FakeServerService extends HttpServiceService<any>{

  customers: any[] = [];

  constructor(httpClient:HttpClient) { 
    super(httpClient);
  }

  override save(data: any): Observable<any> {
    return of(true);
  }
}
