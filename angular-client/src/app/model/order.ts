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
}

export class OrderItem extends Persistable{
  amount!: string;
  itemCode!: string;
  itemDescription!: string;
  itemId!: string;
  price!: string;
  quantity!: number;
}

export enum OrderStatus{
  CREATED,
}

export enum PaymantStatus {
  PENDING,
}
