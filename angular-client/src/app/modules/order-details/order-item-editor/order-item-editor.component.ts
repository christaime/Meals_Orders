import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Filter, ResponsePage } from 'src/app/common/http-service.service';
import { Customer } from 'src/app/model/customer';
import { Item } from 'src/app/model/items';
import { OrderStatus, PaymantStatus } from 'src/app/model/order';
import { CustomersService } from '../../customers/customers.service';
import { ItemsService } from '../../items/items.service';

@Component({
  selector: 'app-order-item-editor',
  templateUrl: './order-item-editor.component.html',
  styleUrls: ['./order-item-editor.component.css']
})
export class OrderItemEditorComponent implements OnInit {

  orderEditor!: FormGroup;
  orderStatusList!: {value:string,name:string}[];
  orderPaymantStatusList!: {value:string,name:string}[];
  customerList!: Observable<Customer[]>;
  customerSelected?: Customer;

  itemFormEditor!: FormGroup;
  itemList!: Observable<Item[]>;
  itemSelected?: Item;

  constructor(private customerService: CustomersService, private itemService: ItemsService) { }

  ngOnInit(): void {
    this.orderEditor = new FormGroup({
      "orderNumber": new FormControl(''),
      "oderDate": new FormControl(''),
      "address": new FormControl(''),
      "orderStatus": new FormControl(OrderStatus[OrderStatus.CREATED]),
      "paymentStatus": new FormControl(PaymantStatus[PaymantStatus.PENDING]),
      "customerCode": new FormControl(''),
      "customerName": new FormControl(''),
      "note": new FormControl('')
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

    this.itemFormEditor = new FormGroup({
      "itemCode": new FormControl(''),
      "itemName": new FormControl(''),
      "price": new FormControl(''),
      "quantity": new FormControl('')
    });

    // Autocomplet init
    this.orderEditor.get("customerCode")?.valueChanges.subscribe( (val)=>{
      let filter = new Filter();
      (filter as any).code = val;
      this.customerService.search(filter).subscribe({
        next: (res:ResponsePage)=>{
          this.customerList = of(res.content as Customer[]);
        },
        error: (err)=>{
          console.error(err);
        }
      });
    });
    this.orderEditor.get("customerName")?.valueChanges.subscribe( (val)=>{
      let filter = new Filter();
      (filter as any).name = val;
      this.customerService.search(filter).subscribe({
        next: (res:ResponsePage)=>{
          this.customerList = of(res.content as Customer[]);
        },
        error: (err)=>{
          console.error(err);
        }
      });
    });

    this.itemFormEditor.get("itemCode")?.valueChanges.subscribe( (val)=>{
      let filter = new Filter();
      (filter as any).code = val;
      this.itemService.search(filter).subscribe({
        next: (res:ResponsePage)=>{
          this.itemList = of(res.content as Item[]);
        },
        error: (err)=>{
          console.error(err);
        }
      });
    });

    this.itemFormEditor.get("itemName")?.valueChanges.subscribe( (val)=>{
      let filter = new Filter();
      (filter as any).description = val;
      this.itemService.search(filter).subscribe({
        next: (res:ResponsePage)=>{
          this.itemList = of(res.content as Item[]);
        },
        error: (err)=>{
          console.error(err);
        }
      });
    });
  }

  selectCustmer(customer:Customer){
    this.customerSelected = customer;
    this.orderEditor.get("customerCode")?.patchValue(customer.code,{onlySelf: true, emitEvent: false});
    this.orderEditor.get("customerName")?.patchValue(customer.name,{onlySelf: true, emitEvent: false});
  }

  clearCustomer(){
    this.customerSelected = undefined;
    this.orderEditor.get("customerCode")?.patchValue('',{onlySelf: true, emitEvent: false});
    this.orderEditor.get("customerName")?.patchValue('',{onlySelf: true, emitEvent: false});
  }

  selectItem(item: Item) {
    this.itemSelected = item;
    this.itemFormEditor.get("itemCode")?.patchValue(item.code,{onlySelf: true, emitEvent: false});
    this.itemFormEditor.get("itemName")?.patchValue(item.description,{onlySelf: true, emitEvent: false});
  }

  clearItem(){
    this.itemSelected = undefined;
    this.itemFormEditor.get("itemCode")?.patchValue('',{onlySelf: true, emitEvent: false});
    this.itemFormEditor.get("itemName")?.patchValue('',{onlySelf: true, emitEvent: false});
  }
}
