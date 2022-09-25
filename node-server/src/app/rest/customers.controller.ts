import { Customer } from "../model/Customer";
import { BaseController } from "./base.controller";
import { Filter, PageResult, QueryParams } from "./Filter";
const { Op } = require("sequelize");


export class CustomersController extends BaseController<Customer>{

    constructor(){
        super(Customer);
    }

    public override buildQueryParams(filter: Filter): QueryParams | any{
        console.log("buildQueryParams");
        let whereClause = {};
        if(filter.text && filter.text.trim()!==""){
            const text = "%"+filter.text.trim().toUpperCase()+"%";
            whereClause = {...whereClause,
                [Op.or]: [
                    {code:{[Op.like]:text}},
                    {name:{[Op.like]:text}},
                ]
            };
        }
        console.log({whereClause});
        return whereClause;
    }
}