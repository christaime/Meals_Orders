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
        let and = false;
        if(filter.text && filter.text.trim()!==""){
            const text = "%"+filter.text.trim().toUpperCase()+"%";
            whereClause = {...whereClause,
                [Op.or]: [
                    {code:{[Op.like]:text}},
                    {description:{[Op.like]:text}},
                ]
            };
            and = true;
        }
        if(filter.code && filter.code.trim()!==""){
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
        if(filter.description && filter.description.trim()!==""){
            const text = "%"+filter.description.trim().toUpperCase()+"%";
            if(and === true){
                whereClause = {...whereClause,
                    [Op.and]: [
                        {description:{[Op.like]:text}}
                    ]
                };
            }else whereClause = {...whereClause,
                description:{[Op.like]:text}
            };
            and = true;
        }
        console.log({whereClause});
        return whereClause;
    }
}