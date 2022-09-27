import { Customer } from "./customer";
import { Persistable } from "./persistable";

export class Order extends Persistable{
    address!: string;
    amount!: string;
    customerCode!: string;
    customerId!: string;
    customerName!: string;
    note!: string;//comment on order ?
    oderDate!: Date;
    orderDetails!: OrderItem[];
    orderNumber!: string;
    orderStatus!: string;
    paymentStatus!: string;
    customer!: Customer;
}

export class OrderItem extends Persistable{
  amount!: string;
  itemCode!: string;
  itemDescription!: string;
  itemId!: string;
  price!: string;
  quantity!: number;
  orderId!: string;
  tmpId?: string;
}

export enum OrderStatus{
  CREATED,
  CANCELLED,
  READY,
  SHIPPED
}

export enum PaymantStatus {
  PENDING,
  PAID
}
