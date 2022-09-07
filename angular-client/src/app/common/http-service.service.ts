import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persistable } from '../model/persistable';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService<T extends Persistable>{

  constructor(private httpClient: HttpClient) { }

  getContextPath(){
    return 'api';
  }

  getHttpHeaders(){
    return {
      headers: new HttpHeaders({
        "application/type":"json"
      })
    }
  }

  getBaseUrl(){
    return this.getContextPath()+"/customers";
  }

  getSaveUrl(): string {
    return this.getBaseUrl()+"/save";
  }

  getDeleteUrl(): string {
    return this.getBaseUrl()+"/delete";
  }

  getByOidUrl(): string {
    return this.getBaseUrl()+"/by-oid";
  }

  getSearchUrl(): string {
    return this.getBaseUrl()+"/search";
  }

  save(data:T): Observable<T>{
    return this.httpClient.post<T>(this.getSaveUrl(),data,this.getHttpHeaders());
  }

  delete(dataOid: string): Observable<any>{
    return this.httpClient.delete(this.getDeleteUrl()+"/"+dataOid,this.getHttpHeaders());
  }

  search(filter:Filter): Observable<ResponsePage>{
    return this.httpClient.post<ResponsePage>(this.getSearchUrl(),filter,this.getHttpHeaders());
  }
}

export class Filter {
  text?: string;
  page!: number;
  pageSize?: number;
}

export class ResponsePage{
  content!: any[];
  number!: number;
  totalElements!: number;
}