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
        let and = false;
        if(filter.text && filter.text.trim()!==""){
            const text = "%"+filter.text.trim().toUpperCase()+"%";
            whereClause = {...whereClause,
                [Op.or]: [
                    {code:{[Op.like]:text}},
                    {name:{[Op.like]:text}},
                ]
            };
            and = true;
        }if(filter.code && filter.code.trim()!==""){
            const text = "%"+filter.code.trim().toUpperCase()+"%";
            if(and === true){
                whereClause = {...whereClause,
                    [Op.and]: [
                        {code:{[Op.like]:text}}
                    ]
                };
            }else whereClause = {...whereClause,
                code:{[Op.like]:text}
            };
            and = true;
        }
        if(filter.name && filter.name.trim()!==""){
            const text = "%"+filter.name.trim().toUpperCase()+"%";
            if(and === true){
                whereClause = {...whereClause,
                    [Op.and]: [
                        {name:{[Op.like]:text}}
                    ]
                };
            }else whereClause = {...whereClause,
                name:{[Op.like]:text}
            };
            and = true;
        }
        console.log({whereClause});
        return whereClause;
    }
}