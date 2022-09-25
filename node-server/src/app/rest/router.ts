import { Express } from "express";
import { BaseController } from "./base.controller";
import { CustomersController } from "./customers.controller";
import { ItemsController } from "./items.contoller";
import { OrdersController } from "./orders.controller";

export class Router {

    constructor(private app:Express, private contextPath: string){
    }

    public initRouting(){
        console.log(`${this.contextPath}/`);
        this.app.get(`${this.contextPath}/`, (req, res) => {
            res.send('Hello World!')
        });
        this.initOtherRouting();
    }

    public initOtherRouting(){

        let orderController = new OrdersController();
        [{base:"customers",controller: new CustomersController()},
         {base:"items", controller: new ItemsController()},
         {base:"orders", controller: orderController}].forEach( (map)=>{
            console.log(`POST ${this.contextPath}/${map.base}/save`);
            this.app.post(`${this.contextPath}/${map.base}/save`,map.controller.save.bind(map.controller));
            console.log(`GET ${this.contextPath}/${map.base}/by-id/:id`);
            this.app.get(`${this.contextPath}/${map.base}/by-id/:id`,map.controller.findById.bind(map.controller));
            console.log(`DELETE ${this.contextPath}/${map.base}/delete/:id`);
            this.app.delete(`${this.contextPath}/${map.base}/delete/:id`,map.controller.deleteById.bind(map.controller));
            console.log(`POST ${this.contextPath}/${map.base}/search`);
            this.app.post(`${this.contextPath}/${map.base}/search`,map.controller.filter.bind(map.controller));
        });
        console.log(`POST ${this.contextPath}/order-items/save`);
        this.app.post(`${this.contextPath}/order-items/save`,orderController.saveOrderItem.bind(orderController));
        console.log(`GET ${this.contextPath}/order-items/by-id/:id`);
        this.app.get(`${this.contextPath}/order-items/by-id/:id`,orderController.findOrderItemById.bind(orderController));
        console.log(`DELETE ${this.contextPath}/order-items/delete/:id`);
        this.app.delete(`${this.contextPath}/order-items/delete/:id`,orderController.deleteOrderItemById.bind(orderController));
        /*console.log(`POST ${this.contextPath}/order-items/search`);
        this.app.post(`${this.contextPath}/order-items/search`,orderController.filter.bind(orderController));*/
        
    }
}