import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutesMapping } from 'src/app/app-routing.module';
import { Filter, ResponsePage } from 'src/app/common/http-service.service';
import { NotificationService } from 'src/app/common/notification.service';
import { Order } from 'src/app/model/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  tableColumns: string[] = ["Number","Customer","Dates","Amounts","Addresses","Notes"];
  datas: readonly Order[] = [];

  pageSizeOptions = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  totalElements = 0;

  filter!: Filter;

  searchControl: FormControl  = new FormControl('');

  currency: string = "$";

  constructor(private service: OrdersService, private notification: NotificationService, private router: Router) { 
    this.filter = new Filter();
  }

  ngOnInit(): void {
      this.search();
  }

  search(text?:string){
    this.filter.text = text;
    this.notification.longProcessOngoing(true);
    this.service.search(this.filter).subscribe( {
      next: (page:ResponsePage)=>{
        this.datas = page.content? page.content : [];
        this.totalElements = page.totalElements;
        this.notification.longProcessOngoing(false);
      },
      error: (er)=>{
        this.notification.longProcessOngoing(false);
        this.notification.error("Fail to get orders");
      }
  });
  }
   
  pageChanged(event:any) {
    console.log({event});
    this.filter.pageSize = event.pageSize;
    this.filter.page = event.pageIndex;
    this.search(this.searchControl.value);
  }

  editEntity(row:Order) {
    this.router.navigate([RoutesMapping.ordersCreate,{id:row.id}])
  }

  deleteEntity(row:Order) {

  }

  sortData(event:any){
    console.log("sortDate ",{event});
    if(event && event.direction !== ""){
      this.filter.sort = event;
      this.search(this.searchControl.value);
    }else {
      this.filter.sort = undefined;
    }
  }
}
