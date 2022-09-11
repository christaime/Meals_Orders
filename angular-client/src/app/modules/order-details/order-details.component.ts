import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { Order, OrderItem } from 'src/app/model/order';
import { OrdersService } from '../orders/orders.service';
import { OrderItemService } from './order.item.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  tableColumns: string[] = ["code", "description","price", "quantity","amount","command"];
  
  public totalAmount: string = '0';

  public order!: Order;
  public orderItems: OrderItem[] = [];

  public itemToEdit!: OrderItem;

  pageSizeOptions = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  totalElements = 0;

  currency: string = "$";
  tmpId = 1;

  constructor(private service:OrderItemService, private notification: NotificationService, private orderService: OrdersService) { 

  }

  ngOnInit(): void {
  }

  saveItem(event: OrderItem){
    if(event.id == null && event.tmpId == null){
      event.tmpId = "" + (++this.tmpId);
    }
    let datas = [...this.orderItems];
    datas.push(event);
    this.orderItems = datas;
    this.totalAmount = "" + (parseFloat(this.totalAmount) + parseFloat(event.amount));
  }

  deleteItem(row: OrderItem){
    console.log("deleteItem",row);
    let datas = [...this.orderItems];
    const index = datas.findIndex((data)=>{ return data.id == row.id && data.tmpId == row.tmpId});
    console.log({datas, index});
    if(index!=-1){  
      this.totalAmount = "" + (parseFloat(this.totalAmount) - parseFloat(row.amount)); 
      if(row.id == null){
        datas.splice(index,1);
        this.orderItems = datas;
      }else {
        this.service.delete(row.id).subscribe( {
          next: (res)=>{
            datas.splice(index,1);
            this.orderItems = datas;
            this.notification.info("Item sucessfully deleted");
          },
          error: (err)=>{
            console.error(err);
            this.notification.error("Item deletion failed");
          }
        });
      }
      
    }
  }

  pageChanged(event:any) {
    console.log({event});
  }

  editOrder(event:Order){
    this.order = {...event};
    console.log({event:event,order:this.order});
  }

  saveOrder(){
    let orderToSave = {...this.order, orderDetails:[...this.orderItems]};
    this.orderService.save(orderToSave).subscribe( {
      next: (res)=>{
        this.notification.info("Order saved");
      },
      error: (er)=>{
        console.error(er);
      }
    }); 
  }
}
