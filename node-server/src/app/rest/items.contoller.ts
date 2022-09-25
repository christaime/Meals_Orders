const { Op } = require('sequelize');
import { Item } from "../model/Item";
import { BaseController } from "./base.controller";
import { Filter, QueryParams } from "./Filter";

export class ItemsController extends BaseController<Item>{

    constructor(){
        super(Item);
    }

    public override buildQueryParams(filter: Filter): QueryParams | any{
        console.log("buildQueryParams");
        let whereClause = {};
        if(filter.text && filter.text.trim()!==""){
            const text = "%"+filter.text.trim().toUpperCase()+"%";
            whereClause = {...whereClause,
                [Op.or]: [
                    {code:{[Op.like]:text}},
                    {description:{[Op.like]:text}},
                ]
            };
        }
        console.log({whereClause});
        return whereClause;
    }
}