import { AppDataSource } from "../db-access/datasource";
import { Customer } from "./Customer";
import { Item } from "./Item";
import { Order, OrderItem } from "./Order";

export class InitDB{

    public static createDBFromModel(){
        Customer.sync();
        Item.sync();
        Order.sync();
        OrderItem.sync();
    }
}