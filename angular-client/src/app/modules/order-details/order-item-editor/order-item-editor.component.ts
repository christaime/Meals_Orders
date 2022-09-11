import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Filter, ResponsePage } from 'src/app/common/http-service.service';
import { Customer } from 'src/app/model/customer';
import { Item } from 'src/app/model/items';
import { Order, OrderItem, OrderStatus, PaymantStatus } from 'src/app/model/order';
import { CustomersService } from '../../customers/customers.service';
import { ItemsService } from '../../items/items.service';

@Component({
  selector: 'app-order-item-editor',
  templateUrl: './order-item-editor.component.html',
  styleUrls: ['./order-item-editor.component.css']
})
export class OrderItemEditorComponent implements OnInit , OnChanges{

  @Input() order!: Order;

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

  currentOrderItemAmount = "";
  @Input()
  currency: string = "$";

  constructor(private customerService: CustomersService, private itemService: ItemsService) { 
    this.order = new Order();
    this.item = new OrderItem();
    this.orderEditor = new FormGroup({
      "orderNumber": new FormControl(this.generateOrderNumber()),
      "oderDate": new FormControl(new Date(Date.now())),
      "address": new FormControl(''),
      "orderStatus": new FormControl(OrderStatus[OrderStatus.CREATED]),
      "paymentStatus": new FormControl(PaymantStatus[PaymantStatus.PENDING]),
      "customer": new FormControl(null, [Validators.required,this.validEntity]),
      "customerCode": new FormControl('', [Validators.required]),
      "customerName": new FormControl('', [Validators.required]),
      "note": new FormControl('')
    });

    this.itemFormEditor = new FormGroup({
      "item": new FormControl(null, [Validators.required,this.validEntity]),
      "itemCode": new FormControl('', [Validators.required]),
      "itemName": new FormControl('', [Validators.required]),
      "price": new FormControl('', [Validators.required ,Validators.min(0)]),
      "quantity": new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["item"]){
      this.itemFormEditor.patchValue(this.item);
    }
    if(changes["order"]){
      this.orderEditor.patchValue(this.order);
    }
  }

  ngOnInit(): void {  
     
    this.orderEditor.valueChanges.subscribe( (orderValue)=>{
      if(this.orderEditor.valid==true){
        let order = {...orderValue};
        order.customerId = this.customerSelected?.id;
        this.orderChanged.emit(orderValue);
      }
    });

    this.itemFormEditor.valueChanges.subscribe( (val)=>{
      if(this.itemSelected != null){
        let item = {...this.itemFormEditor.value};
        try{
          this.currentOrderItemAmount =  ""+(parseFloat(item.price) * parseFloat(item.quantity));
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
    this.orderEditor.get("customer")?.patchValue(customer,{onlySelf: true, emitEvent: false});
    this.orderEditor.get("customerCode")?.patchValue(customer.code,{onlySelf: true, emitEvent: false});
    this.orderEditor.get("customerName")?.patchValue(customer.name,{onlySelf: true, emitEvent: false});
  }

  clearCustomer(){
    this.customerSelected = undefined;
    this.customerPropertyEdited='';
    this.orderEditor.get("customer")?.patchValue(null,{onlySelf: true, emitEvent: false});
    this.orderEditor.get("customerCode")?.patchValue('',{onlySelf: true, emitEvent: false});
    this.orderEditor.get("customerName")?.patchValue('',{onlySelf: true, emitEvent: false});
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
    this.itemPropertyEdited='';
    this.currentOrderItemAmount = "";
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
    }catch(e){
      console.error(e);
    }
    this.clearItem();
    this.saveItem.emit(item);
  }

  validEntity(c: FormControl){
    return c.value !=null && typeof c.value !== 'string'? null: {validEntity:{valid:false}};
  }

}
