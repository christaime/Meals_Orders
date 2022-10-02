import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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
        'Content-Type':  'application/json',
      })
    }
  }

  getBaseUrl(){
    return this.getContextPath();
  }

  getSaveUrl(): string {
    return this.getBaseUrl()+"/save";
  }

  getDeleteUrl(): string {
    return this.getBaseUrl()+"/delete";
  }

  getByOidUrl(): string {
    return this.getBaseUrl()+"/by-id";
  }

  getSearchUrl(): string {
    return this.getBaseUrl()+"/search";
  }

  save(data:T): Observable<T>{
    return this.httpClient.post<T>(this.getSaveUrl(),data,this.getHttpHeaders()).pipe().pipe(
      catchError(this.handleError)
    );
  }

  delete(dataOid: string): Observable<any>{
    return this.httpClient.delete(this.getDeleteUrl()+"/"+dataOid,this.getHttpHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  get(dataOid: string): Observable<any>{
    return this.httpClient.get(this.getByOidUrl()+"/"+dataOid,this.getHttpHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  search(filter:Filter): Observable<ResponsePage>{
    return this.httpClient.post<ResponsePage>(this.getSearchUrl(),filter,this.getHttpHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse){
    console.log("httpErrorResponse, ", err);
    let errorMessage = "Server error!";
    if(err.status === 500){
      errorMessage = err.error;
    }
    console.log({errorMessage});
    return throwError( ()=> errorMessage);
  }
}

export class Filter {
  public static MAX_PAGE_COUNT=25;
  public sort?: {active: string, direction: string};
  constructor(){
    this.page = 0;
    this.pageSize = Filter.MAX_PAGE_COUNT;
  }
  text?: string;
  page!: number;
  pageSize?: number;
}

export class ResponsePage{
  content!: any[];
  number!: number;
  totalElements!: number;
}