
import Model from "sequelize/types/model";
import { Filter, PageResult, QueryParams } from "./Filter";
const { Op, db } = require("sequelize");

export class BaseController<T extends Model>{
    constructor(private entity:T|any){

    }

    public save(req:any, res:any){
        console.log("save",req.body);
        let entity = req.body;
        if(entity.id !== undefined && entity.id !== null){
            //let entityFound = await this.entity.findByPk(entity.id);
            this.entity.update(entity,{where:{id:entity.id}}).then( async (result: any) =>{
                console.log({entity});
                let entityFound = await this.entity.findByPk(entity.id);
                console.log({entity});
                res.send(entityFound);
            }).catch((err: { message: any; }) =>{
                console.error("update error",err);
                res.status(500).send({error:err.message});
            });
        }else{
            const data = this.entity.build(entity);
            data.save().then( (dataSaved: any) =>{
                console.log("save new result ",dataSaved)
                res.send(dataSaved);
            }).catch((err: { message: any; }) =>{
                console.error("save error",err);
                res.status(500).send({error:err.message});
            });
        }
    }

    public deleteById(req:any, res:any){
        console.log("deleteById",req.params);
        const id = req.params.id;
        this.entity.destroy({where:{id:id}}).then( (result: any) =>{
            console.log("detroy result",result);
            res.send(true);
        }).catch((err: { message: any; name: any}) =>{
            let entityModelName = this.entity.options.name.singular;
            console.error("deleteById error",err.name,err);
            if(err.name === "SequelizeForeignKeyConstraintError"){
                res.status(500).send("You can't delete this "+ entityModelName + ". First delete all operations the "+ entityModelName  + " is linked to.");
            } else{
                res.status(500).send(err.message);
            }
        });
    }

    public findById(req:any, res:any){
        console.log("findById",req.params);
        const id = req.params.id;
        this.entity.findByPk(id,this.findByInclude()).then( (result: any) =>{
            console.log("findById", result);
            res.send(result);
        }).catch((err: { message: any; }) =>{
            console.error("findById error",err);
            res.status(500).send({error:err.message});
        });
    }

    public filter(req:any, res:any){
        console.log("filter",req.body);
        let filter: Filter = req.body; 
        console.log({this:this});
        let whereClause = this.buildQueryParams(filter); 
        let queryParams:QueryParams = {where: whereClause};
        queryParams = {...queryParams, ...this.filterIncludes()};
        let query = this.entity.findAll(queryParams);
        let order = this.getOrder(filter);
        console.log({order});
        if(order !== null){
            (queryParams as any).order = order;
        }
        let findCount = false;
        if(filter.page !== null && filter.page !== undefined){
            let page = filter.page;
            let pageSize = filter.pageSize? filter.pageSize : Filter.MAX_PAGE_COUNT;
            queryParams.offset = page*pageSize;
            queryParams.limit = pageSize;
            
            query = this.entity.findAndCountAll(queryParams);
            findCount = true;
        }
        query.then( (result: any) =>{
            res.send(findCount === true? new PageResult(result,filter):result);
        }).catch((err: { message: any; }) =>{
            console.error("filter error",err);
            res.status(500).send({error:err.message});
        });
    }

    public buildQueryParams(filter: Filter): QueryParams | any{
        return {};
    }

    public filterIncludes():any{
        return {};
    }

    public findByInclude(){
        return {};
    }

    public getOrder(filter: Filter): any{
        return  filter && filter.sort && filter.sort.direction !== "" ? [[filter.sort.active,filter.sort.direction.toUpperCase()]] : null;
    }
} 