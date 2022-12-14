import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  pageSize = this.pageSizeOptions[1];
  totalElements = 0;

  currency: string = "$";
  tmpId = 1;

  constructor(private service:OrderItemService, private notification: NotificationService,
    private route: ActivatedRoute,
     private orderService: OrdersService) { 
      this.order = new Order();

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (data)=>{
       console.log('order-details ngOnInit ', data);
       let id = (data as any).params? (data as any).params.id : null;
       if(id !== null && id !== undefined){
        this.notification.longProcessOngoing(true);
        this.orderService.get(id).subscribe( {
          next: (order)=>{
            this.notification.longProcessOngoing(false);
            order.customerId = order.customer?.id;
            this.order = order;
            this.orderItems = order && order.orderDetails? order.orderDetails : [];
            this.totalAmount = ""+parseFloat(this.order.amount);
          },
          error: (err)=>{
            this.notification.longProcessOngoing(false);
          }
        });
       }
    })
  }

  saveItem(event: OrderItem){
    let datas = [...this.orderItems];
    let index = datas.findIndex( (it)=>{ return it.id === event.id});
    let total = this.totalElements + 1;
    if(index !== -1){
      datas.splice(index,1,event);
    } else {
      datas.push(event);
    }  
    this.totalElements = total;
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
        let total = this.totalElements - 1;
        this.notification.longProcessOngoing(true);
        this.service.delete(row.id).subscribe( {
          next: (res)=>{
            this.notification.longProcessOngoing(false);
            datas.splice(index,1);
            this.orderItems = datas;
            this.totalElements = total;
            this.notification.info("Item sucessfully deleted");
          },
          error: (err)=>{
            this.notification.longProcessOngoing(false);
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
  

  editOrderItem(row:OrderItem){
    this.itemToEdit = row;
  }
}
