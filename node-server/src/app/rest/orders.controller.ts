
const { Op , sequelize} = require('sequelize');
import { Customer } from "../model/Customer";
import { Item } from "../model/Item";
import { Order, OrderItem } from "../model/Order";
import { BaseController } from "./base.controller";
import { Filter, PageResult, QueryParams } from "./Filter";

export class OrdersController extends BaseController<Order>{

    constructor(){
        super(Order);
    }

    public saveOrderItem(req:any, res:any){
        console.log("saveOrderItem",req.body);
        const item = OrderItem.build(req.body);
        item.save().then( async (dataSaved: any) =>{
            //Update Order and is amount
            const orderAmount = await sequelize.query("SELECT SUM(amount) FROM "+OrderItem.getTableName()+" WHERE orderId ="+item.orderId);
            console.log({orderAmount});
            const updateResult = await sequelize.query("UPDATE "+Order.getTableName()+" SET amount = "+orderAmount+" WHERE id ="+item.orderId);        
            console.log({updateResult});
            res.send(dataSaved);
        }).catch((err: { message: any; }) =>{
            res.status(500).send({error:err.message});
        });
    }

    public deleteOrderItemById(req:any, res:any){
        console.log("deleteOrderItemById",req.params);
        const id = req.params.id;
        OrderItem.destroy({where:{id:id},force:true}).then( (result: any) =>{
            res.send(result);
        }).catch((err: { message: any; }) =>{
            res.status(500).send({error:err.message});
        });
    }

    public findOrderItemById(req:any, res:any){
        console.log("findOrderItemById",req.params);
        const id = req.params.id;
        OrderItem.findByPk(id).then( (result: any) =>{
            res.send(result);
        }).catch((err: { message: any; }) =>{
            res.status(500).send({error:err.message});
        });
    }

    public override buildQueryParams(filter: Filter): QueryParams | any{
        console.log("buildQueryParams");
        let whereClause = {};
        if(filter.text && filter.text.trim()!==""){
            const text = "%"+filter.text.trim().toUpperCase()+"%";
            whereClause = {...whereClause,
                [Op.or]: [
                    {orderNumber:{[Op.like]:text}},
                    {note:{[Op.like]:text}},
                    {address:{[Op.like]:text}},
                    {customer:{
                        name:{[Op.like]:text}
                       }
                    },
                ]
            };
        }

        console.log({whereClause});
        return whereClause;
    }

    public override filterIncludes():any{
        return { include:Customer};
    }

    public override findByInclude(){
        return { include:Customer};
    }

}