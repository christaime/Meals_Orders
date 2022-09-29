
const { Op , sequelize} = require('sequelize');
import { Transaction } from "sequelize";
import { AppDataSource } from "../db-access/datasource";
import { Customer } from "../model/Customer";
import { Item } from "../model/Item";
import { Order, OrderItem } from "../model/Order";
import { BaseController } from "./base.controller";
import { Filter, PageResult, QueryParams } from "./Filter";

export class OrdersController extends BaseController<Order>{

    constructor(){
        super(Order);
    }

    public async saveOrderItem(req:any, res:any){
        console.log("saveOrderItem",req.body);  
        let entity = req.body;  
        let transac: Transaction = await AppDataSource.getAppDatabaseSource().transaction();    
        try{   
            let orderId = entity.orderId;         
            if(entity.id !== undefined && entity.id !== null){
                const updated = await OrderItem.update(entity,{transaction: transac,where:{id:entity.id}});
            }else{
                entity = await OrderItem.build(entity).save({transaction: transac});
            }
            console.log(" orderItem ", entity);
            let subquery = "(SELECT SUM(amount) FROM "+OrderItem.getTableName()+" WHERE orderId ="+orderId+")";
            const updateResult = await AppDataSource.getAppDatabaseSource().query("UPDATE "+Order.getTableName()
            +" SET amount = "+subquery+" WHERE id ="+orderId,{transaction: transac});        
            console.log({updateResult});
            transac.commit();
            res.send(entity);
        } catch (e){
            console.error(e);
            transac.rollback();
            res.status(500).send({error: (e as any).message});
        }
    }

    public async deleteOrderItemById(req:any, res:any){
        console.log("deleteOrderItemById",req.params);
        const id = req.params.id;
        let transac: Transaction = await AppDataSource.getAppDatabaseSource().transaction();
        try{
            let item:OrderItem = await OrderItem.findByPk(id,{transaction: transac});
            let orderId = item.orderId;
            await item.destroy({transaction: transac});
            let subquery = "(SELECT SUM(amount) FROM "+OrderItem.getTableName()+" WHERE orderId ="+orderId+")";
            const updateResult = await AppDataSource.getAppDatabaseSource().query("UPDATE "+Order.getTableName()
            +" SET amount = "+subquery+" WHERE id ="+orderId,{transaction: transac});        
            console.log({updateResult});
            transac.commit();
            res.send(true);
        } catch (e){
            console.error(e);
            transac.rollback();
            res.status(500).send({error: (e as any).message});
        }
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
                    {'$customer.name$':{[Op.like]:text}}
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
        return { include: [
            { model: Customer},
            { model:OrderItem, as: 'orderDetails', include: Item}
        ]};
    }

    public override getOrder(filter: Filter): any{
        if(filter.sort && filter.sort.active === "customer.name"){
            return [[{model: Customer, as: 'customer'}, 'name', filter.sort.direction !== "" ? filter.sort.direction.toUpperCase() : "DESC"]];
        } else {
            return super.getOrder(filter);
        }
    }
}