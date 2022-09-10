import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filter, HttpServiceService, ResponsePage } from '../common/http-service.service';
import { Customer, Gender } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class FakeServerService extends HttpServiceService<any>{

  autoIncrement = 0;
  customers: any[] = [];

  constructor(httpClient:HttpClient) { 
    super(httpClient);
    console.log("FakeServerService",this);
    this.initDats();
  }

  override save(data: any): Observable<any> {
    console.log("save",this.getSaveUrl(),data);
    if(this.getSaveUrl().indexOf("customers") != -1){
      data.id = ++this.autoIncrement +'';
      this.customers.push(data);
      return of(data);
    }
    return this.save(data);
  }

  override search(filter: Filter): Observable<ResponsePage> {
    console.log("search",this.getSearchUrl(),filter);
    if(this.getSearchUrl().indexOf("customers") != -1){
      let response = new ResponsePage();
      response.content = this.customers;
      response.number = 1;
      response.totalElements = this.customers.length;
      return of(response);
    }
    return this.search(filter);
  }

  public initDats(){
    let customerId = 1;
    let customer = new Customer("JHJHJHJ","Alfred Hitlang");
    customer.id = "" + (customerId++);
    customer.phone = "54587854501";
    customer.address = "AD WEST LANE";
    customer.email = "alfred-test@gmail.com";
    customer.gender = Gender[Gender.MALE];

    let customer1 = new Customer("GBVTTRTR","Ingrid Laforge");
    customer1.id = "" + (customerId++);
    customer1.phone = "695980545";
    customer1.address = "AD WEST LANE";
    customer1.email = "ingrid-test@gmail.com";
    customer1.gender = Gender[Gender.FEMALE];

    let customer2 = new Customer("GBVVVRF","Laurent Boclai");
    customer2.id = "" + (customerId++);
    customer2.phone = "9898656666";
    customer2.address = "AD EAST AVENUE";
    customer2.email = "laurent@gmail.com";
    customer2.gender = Gender[Gender.MALE];

    let customer3 = new Customer("TRAFZGZ","Cecile Laforge");
    customer3.id = "" + (customerId++);
    customer3.phone = "656565014";
    customer3.address = "AD EAST AVENUE";
    //customer3.email = "cecile@gmail.com";
    customer3.gender = Gender[Gender.FEMALE];

    this.customers = [customer, customer1, customer2, customer3];
  }
}
