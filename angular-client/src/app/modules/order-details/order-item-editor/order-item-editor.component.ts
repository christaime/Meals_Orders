import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Filter, ResponsePage } from 'src/app/common/http-service.service';
import { NotificationService } from 'src/app/common/notification.service';
import { Customer } from 'src/app/model/customer';
import { Item } from 'src/app/model/items';
import { Order, OrderItem, OrderStatus, PaymantStatus } from 'src/app/model/order';
import { CustomersService } from '../../customers/customers.service';
import { ItemsService } from '../../items/items.service';
import { OrdersService } from '../../orders/orders.service';
import { OrderItemService } from '../order.item.service';

@Component({
  selector: 'app-order-item-editor',
  templateUrl: './order-item-editor.component.html',
  styleUrls: ['./order-item-editor.component.css']
})
export class OrderItemEditorComponent implements OnInit , OnChanges{

  @Input() order!: Order;

  @Input() totalOrderAmount!: string;

  @Input() item!: OrderItem;

  @Output() saveItem: EventEmitter<OrderItem> = new EventEmitter<OrderItem>();

  @Output() orderChanged: EventEmitter<Order> = new EventEmitter<Order>();

  orderEditor!: FormGroup;
  orderStatusList!: {value:string,name:string}[];
  orderPaymantStatusList!: {value:string,name:string}[];
  customerList!: Customer[];
  customerSelected?: Customer;
  customerPropertyEdited: string = "";

  itemFormEditor!: FormGroup;
  itemList!: Item[];
  itemSelected?: Item;
  itemPropertyEdited: string = "";

  currentOrderItemAmount = "0";
  @Input()
  currency: string = "$";

  constructor(private customerService: CustomersService, private orderItemService: OrderItemService,
    private itemService: ItemsService, private orderService: OrdersService,
     private notification: NotificationService) { 
    this.order = new Order();
    this.item = new OrderItem();
    this.orderEditor = new FormGroup({
      "orderNumber": new FormControl(this.generateOrderNumber()),
      "oderDate": new FormControl(new Date(Date.now())),
      "address": new FormControl(''),
      "orderStatus": new FormControl(OrderStatus[OrderStatus.CREATED]),
      "paymentStatus": new FormControl(PaymantStatus[PaymantStatus.PENDING]),
      "customer": new FormControl(null, [Validators.required,this.validEntity]),
      "customerCode": new FormControl(''),
      "customerName": new FormControl(''),
      "note": new FormControl('')
    });

    this.itemFormEditor = new FormGroup({
      "item": new FormControl(null, [Validators.required,this.validEntity]),
      "itemCode": new FormControl(''),
      "itemName": new FormControl(''),
      "price": new FormControl('', [Validators.required ,Validators.min(0)]),
      "quantity": new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["item"]){
      this.itemFormEditor.patchValue(this.item);
    }
    if(changes["totalOrderAmount"]){
       this.order.amount = this.totalOrderAmount;
       console.log("totalOrderAmount ", this.totalOrderAmount);
    }
    if(changes["order"]){
      console.log("order changed ", this.order);
      this.orderEditor.patchValue(this.order,{onlySelf:true, emitEvent:false});
      this.customerSelected = this.order?.customer;
    }
  }

  ngOnInit(): void { 

    this.itemFormEditor.valueChanges.subscribe( (val)=>{
      if(this.itemSelected != null){
        let item = {...this.itemFormEditor.value};
        try{
          let price = parseFloat(item.price);
          let quantity = parseInt(item.quantity);
          price = Number.isNaN(price)? 0 : price;
          quantity = Number.isNaN(quantity)? 0 : quantity;
          this.currentOrderItemAmount =  ""+( price * quantity);
        }catch(e){
          console.error(e);
        }
        
      }      
    });

    let tmpStatusList: {value:string,name:string}[] = [];
    [OrderStatus.CREATED,OrderStatus.CANCELLED,OrderStatus.READY,OrderStatus.SHIPPED].forEach( (status)=>{
      tmpStatusList.push(
        { value: OrderStatus[status], name: OrderStatus[status]}
      )
    });
    this.orderStatusList = [...tmpStatusList];

    tmpStatusList = [];
    [PaymantStatus.PENDING,PaymantStatus.PAID].forEach( (status)=>{
      tmpStatusList.push(
        { value: PaymantStatus[status], name: PaymantStatus[status]}
      )
    });
    this.orderPaymantStatusList = tmpStatusList;

    // Autocomplet init
    this.orderEditor.get("customer")?.valueChanges.subscribe( (val)=>{
      if(typeof val === "string"){
        let filter = new Filter();
        (filter as any)[this.customerPropertyEdited] = val;        
        this.customerService.search(filter).subscribe({
          next: (res:ResponsePage)=>{
            this.customerList = res.content as Customer[];
          },
          error: (err)=>{
            console.error(err);
          }
        });
      } else {
        this.selectCustmer(val);
      }
    });
    
    this.itemFormEditor.get("item")?.valueChanges.subscribe( (val)=>{
      if(typeof val === "string"){
        let filter = new Filter();
        (filter as any)[this.itemPropertyEdited] = val; 
        this.itemService.search(filter).subscribe({
          next: (res:ResponsePage)=>{
            this.itemList = res.content as Item[];
          },
          error: (err)=>{
            console.error(err);
          }
        });
      } else {
        this.selectItem(val);
      }
    });

  }

  orderChangedManage(notify?:boolean){
    let orderValue = this.orderEditor.value;
    console.log("orderEditor.valueChanges",orderValue);
    this.orderEditor.markAllAsTouched();
    console.log("validity ", this.orderEditor.valid);
      if(this.orderEditor.valid===true){
        let order = {...this.order,...orderValue};
        order.customerId = this.customerSelected?.id;
        this.notification.longProcessOngoing(true);
        this.orderService.save(order).subscribe( {
          next: (res)=>{
            this.notification.longProcessOngoing(false);
            if(notify){this.notification.info("Order saved sucessfully!");}
            this.order = res;
          },
          error: (er)=>{
            this.notification.longProcessOngoing(false);
            if(notify){this.notification.info("Failled to save Order!");}
            console.error(er);
          }
        }); 
        this.orderChanged.emit(order);
      }
  }

  customerCodeEdited(event:any){
    console.log("customerCodeEdited",event);
  }

  displayCustomerCode(customer:Customer){
    return customer? customer.code : "";
  }

  displayCustomerName(customer:Customer){
    return customer? customer.name : "";
  }

  displayItemCode(item:Item){
    return item? item.code : "";
  }

  displayItemDescription(item:Item){
    return item? item.description : "";
  }

  selectCustmer(customer:Customer){
    this.customerSelected = customer;
    this.customerPropertyEdited='';
    console.log("selectCustmer",customer);
    this.orderEditor.get("customer")?.patchValue(customer,{onlySelf: false, emitEvent: false});
    this.orderEditor.get("customerCode")?.patchValue(customer.code,{onlySelf: false, emitEvent: false});
    this.orderEditor.get("customerName")?.patchValue(customer.name,{onlySelf: false, emitEvent: false});
    this.orderChangedManage(true);
  }

  clearCustomer(){
    this.customerSelected = undefined;
    this.customerPropertyEdited='';
    this.orderEditor.get("customer")?.patchValue(null,{onlySelf: false, emitEvent: false});
    this.orderEditor.get("customerCode")?.patchValue('',{onlySelf: false, emitEvent: false});
    this.orderEditor.get("customerName")?.patchValue('',{onlySelf: false, emitEvent: false});
    this.customerList = [];
  }

  selectItem(item: Item) {  
    if(item && item.id!=null){
      this.itemSelected = item;
      this.itemFormEditor.get("item")?.patchValue(item,{onlySelf: true, emitEvent: false});
      this.itemFormEditor.get("itemCode")?.patchValue(item.code,{onlySelf: true, emitEvent: false});
      this.itemFormEditor.get("itemName")?.patchValue(item.description,{onlySelf: true, emitEvent: false});
      this.itemFormEditor.get("price")?.patchValue(item.price,{onlySelf: true, emitEvent: false});
      this.itemFormEditor.get("quantity")?.patchValue(1,{onlySelf: true, emitEvent: false});
    }
  }

  clearItem(){
    this.itemSelected = undefined;
    this.itemFormEditor.reset({});
    this.itemFormEditor.get('itemCode')?.setValue('');
    this.itemFormEditor.get('itemName')?.setValue('');
    this.itemFormEditor.updateValueAndValidity();
    this.itemPropertyEdited='';
    this.currentOrderItemAmount = "0";
    this.itemList = [];
  }

  generateOrderNumber(){
    return new Date(Date.now()).getTime();
  }

  saveEditedItem(){
    let item = {...this.item,...this.itemFormEditor.value};
    item.itemId = this.itemSelected?.id;
    try{
      let price = parseFloat(item.price);
      let quantity = parseFloat(item.quantity? item.quantity:0);
      let amount = (price!=NaN? price: 0) * (quantity!=NaN? quantity:0);
      item.amount = amount;
      if(this.orderEditor.valid!=true){
        this.notification.error("invalid order");
        this.orderEditor.markAllAsTouched();
        this.orderEditor.markAsDirty();
        this.orderEditor.updateValueAndValidity();
      }else {       
          item.itemId = this.itemSelected?.id;
          item.orderId = this.order?.id;
          this.notification.longProcessOngoing(true);
          this.orderItemService.save(item).subscribe({
            next: (itemSaved:OrderItem)=>{
              this.notification.longProcessOngoing(false);
              this.clearItem();
              item.id = itemSaved.id;
              this.saveItem.emit(item);
              this.notification.info("Order item saved");
            },
            error: (err)=>{
              this.notification.longProcessOngoing(false);
              this.notification.error("Item save failed");
            }
          });        
      }
    }catch(e){
      console.error(e);
    }
    
  }

  // Validators for Persistable
  validEntity(c: FormControl){
    return c.value !=null && typeof c.value !== 'string'? null: {validEntity:{valid:false}};
  }
}
