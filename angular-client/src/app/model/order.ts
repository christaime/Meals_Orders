export class Order {
    address!: string;
    amount!: string;
    customerCode!: string;
    customerId!: string;
    customerName!: string;
    id!: string;
    note!: string;//comment on order ?
    oderDate!: Date;
    orderDetails!: OrderItem[];
    orderNumber!: string;
    orderStatus!: string;
    paymentStatus!: string;
}

export class OrderItem {
  amount: string;
  itemCode: string;
  itemDescription: string;
  itemId: string;
  price: string;
  quantity: number;
}

export enum OrderStatus{
  CREATED,
}

export PaymantStatus {
  PENDING,
}
