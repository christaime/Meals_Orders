import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filter, HttpServiceService, ResponsePage } from '../common/http-service.service';
import { Customer, Gender } from '../model/customer';
import { Item } from '../model/items';
import { Order, OrderItem, OrderStatus, PaymantStatus } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class FakeServerService extends HttpServiceService<any>{

  autoIncrement = 0;
  customers: any[] = [];
  items: any[] = [];
  orders: any[] = [];

  public type: string="";

  constructor(httpClient:HttpClient) { 
    super(httpClient);
    this.autoIncrement = 0;
    console.log("FakeServerService",this);
    this.initCustomers();
    this.initItems();
    this.initOrders();
  }

  override getBaseUrl(): string {
    return this.getContextPath()+'/'+this.type;
  }

  override get(id: any): Observable<any> {
    console.log("get",this.getByOidUrl(),id);
    this.autoIncrement++;
    if(this.type == "customers"){
      let data = this.customers.find( (el)=> el.id === id);
      console.log("customer find",data);
      return of(data);
    } else if(this.type == "items"){
      let data = this.items.find( (el)=> el.id === id);
      console.log("item found",data);
      return of(data);
    }else if(this.type == "orders"){
      let data = this.orders.find( (el)=> el.id === id);
      console.log("orders found",data);
      return of(data);
    }
    return super.get(id);
  }

  override save(data: any): Observable<any> {
    console.log("save",this.getSaveUrl(),data);
    this.autoIncrement++;
    if(this.type == "customers"){
      if(data.id===null || data.id===undefined){data.id = this.autoIncrement;}
      data.editable = false;
      this.customers.push(data);
      console.log("customer saved",data);
      return of(data);
    } else if(this.type == "items"){
      if(data.id===null || data.id===undefined){data.id = this.autoIncrement;}
      data.editable = false;
      this.items.push(data);
      return of(data);
    } else if(this.type == "order-items"){
      if(data.id===null || data.id===undefined){data.id = this.autoIncrement;}
      data.editable = false;
      let order = this.orders.find( (order)=>{ return order.id === data.orderId});
      if(order){
        if(!order.orderDetails){ order.orderDetails = [];}
        order.orderDetails.push(data);
      }
      return of(data);
    }else if(this.type == "orders"){
      if(data.id===null || data.id===undefined){data.id = this.autoIncrement;}
      data.editable = false;
      this.orders.push(data);
      return of(data);
    }
    return super.save(data);
  }

  override search(filter: Filter): Observable<ResponsePage> {
    console.log("search",this.getSearchUrl(),filter);
    if(this.type == "customers"){
      let response = new ResponsePage();
      let flteredList = this.customers.filter( (el)=> {
        if((filter as any)['code']!=null){
          return (filter as any)['code'].trim()=='' || el.code.toUpperCase().startsWith((filter as any)['code'].trim().toUpperCase());
        }else if((filter as any)['name']!=null){
          return (filter as any)['name'].trim()=='' || el.name.toUpperCase().startsWith((filter as any)['name'].trim().toUpperCase());
        }else if((filter as any)['text']!=null){
          return (filter as any)['text'].trim()=='' 
                || el.code.toUpperCase().startsWith((filter as any)['text'].trim().toUpperCase())
                || el.name.toUpperCase().startsWith((filter as any)['text'].trim().toUpperCase())
                || el.address.toUpperCase().startsWith((filter as any)['text'].trim().toUpperCase());
        } else {
          return true;
        }
      });
      console.log({flteredList});
      let start = filter.page*(filter.pageSize? filter.pageSize:0);
      response.content = filter.page != null? flteredList.slice(start,start+(filter.pageSize? filter.pageSize:0)) : flteredList;
      response.number = 1;
      response.totalElements = flteredList.length;
      return of(response);
    } else if(this.type == "items"){
      let response = new ResponsePage();
      let flteredList = this.items.filter( (el)=> {
        if((filter as any)['code']!=null){
          return (filter as any)['code'].trim()=='' || el.code.toUpperCase().startsWith((filter as any)['code'].trim().toUpperCase());
        }else if((filter as any)['description']!=null){
          return (filter as any)['description'].trim()=='' || el.description.toUpperCase().startsWith((filter as any)['description'].trim().toUpperCase());
        } else {
          return true;
        }
      });
      console.log({flteredList});
      let start = filter.page*(filter.pageSize? filter.pageSize:0);
      response.content = filter.page != null? flteredList.slice(start,start+(filter.pageSize? filter.pageSize:0)) : flteredList;
      response.number = 1;
      response.totalElements = flteredList.length;
      
      return of(response);
    } else if(this.type == "orders"){
      let response = new ResponsePage();
      let flteredList = this.orders.filter( (el)=> {
        if((filter as any)['text']!==null && (filter as any)['text']!==undefined){
          return (filter as any)['text'].trim()=='' || el.number.toUpperCase().startsWith((filter as any)['text'].trim().toUpperCase())
          || el.customerName.toUpperCase().startsWith((filter as any)['text'].trim().toUpperCase());
        } else{
          return true;
        }
      });
      console.log({flteredList});
      let start = filter.page*(filter.pageSize? filter.pageSize:0);
      response.content = filter.page != null? flteredList.slice(start,start+(filter.pageSize? filter.pageSize:0)) : flteredList;
      response.number = 1;
      response.totalElements = flteredList.length;
      
      return of(response);
    }
    return super.search(filter);
  }

  public initCustomers(){
    this.autoIncrement++;
    let customer = new Customer("JHJHJHJ","Alfred Hitlang".toUpperCase());
    customer.id = "" + (this.autoIncrement++);
    customer.phone = "54587854501";
    customer.address = "AD WEST LANE";
    customer.email = "alfred-test@gmail.com";
    customer.gender = Gender[Gender.MALE];

    let customer1 = new Customer("GBVTTRTR","Ingrid Laforge".toUpperCase());
    customer1.id = "" + (this.autoIncrement++);
    customer1.phone = "695980545";
    customer1.address = "AD WEST LANE";
    customer1.email = "ingrid-test@gmail.com";
    customer1.gender = Gender[Gender.FEMALE];

    let customer2 = new Customer("GBVVVRF","Laurent Boclai".toUpperCase());
    customer2.id = "" + (this.autoIncrement++);
    customer2.phone = "9898656666";
    customer2.address = "AD EAST AVENUE";
    customer2.email = "laurent@gmail.com";
    customer2.gender = Gender[Gender.MALE];

    let customer3 = new Customer("TRAFZGZ","Cecile Laforge".toUpperCase());
    customer3.id = "" + (this.autoIncrement++);
    customer3.phone = "656565014";
    customer3.address = "AD EAST AVENUE";
    //customer3.email = "cecile@gmail.com";
    customer3.gender = Gender[Gender.FEMALE];

    this.customers = [customer, customer1, customer2, customer3];
  }

  public initItems(){
    let item = new Item();
    item.code = "HGHHGH";
    item.description = "Beignets haricots";
    item.price = "500";
    item.id = "" + (++this.autoIncrement);

    let item1 = new Item();
    item1.code = "UIOO014";
    item1.description = "Okok manioc";
    item1.price = "700";
    item1.id = "" + (++this.autoIncrement);

    let item2 = new Item();
    item2.code = "UIOVG4";
    item2.description = "Riz sauce tomate";
    item2.price = "1500";
    item2.id = "" + (++this.autoIncrement);

    let item3 = new Item();
    item3.code = "UIO784";
    item3.description = "Poisson braisé";
    item3.price = "1200";
    item3.id = "" + (++this.autoIncrement);

    let item4 = new Item();
    item4.code = "UI9784";
    item4.description = "Poulet braisé";
    item4.price = "1200";
    item4.id = "" + (++this.autoIncrement);

    let item5 = new Item();
    item5.code = "UUY84";
    item5.description = "Heroo";
    item5.price = "1200";
    item5.id = "" + (++this.autoIncrement);

    this.items = [item, item1, item2, item3, item4, item5];
  }

  initOrders(){
    let order = new Order();
    order.id = "" + (++this.autoIncrement);
    order.address = "An adress";
    order.amount = "50000";
    order.customerCode = this.customers[0].code;
    order.customerName = this.customers[0].name;
    order.customerId = this.customers[0].id;
    order.note = "My special meal order";
    order.orderNumber = "989898989";
    order.oderDate = new Date(Date.now());
    order.orderStatus = OrderStatus[OrderStatus.CREATED];
    order.paymentStatus = PaymantStatus[PaymantStatus.PENDING];
    (order as any).customer = this.customers[0];
    let orderItem = new OrderItem();
    orderItem.id = "" + (++this.autoIncrement);
    orderItem.amount = "50000";
    orderItem.itemCode = this.items[0].code;
    orderItem.itemId = this.items[0].id;
    (orderItem as any).item = this.items[0];
    orderItem.itemDescription = this.items[0].description;
    orderItem.price = "2000";
    orderItem.quantity=25;
    order.orderDetails = [orderItem];

    this.orders = [order];

  }
}
