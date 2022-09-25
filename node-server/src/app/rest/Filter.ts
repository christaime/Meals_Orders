
export class Filter{
    public static MAX_PAGE_COUNT=25;
    page?:number;
    pageSize?: number;
    text?: string;
    constructor(page?: number, pageSize?:number){
        this.page = page;
        this.pageSize = pageSize;
    }
}

export interface QueryParams{
    where?: any,
    offset?: number,
    limit?: number,
}

export class PageResult extends Filter{
    content!: any[];
    totalElements!:number;
    number!: number;
    constructor(queryResult:{count:number, rows:any[]}, filter:Filter){
        super(filter.page,filter.pageSize);
        this.totalElements = queryResult.count;
        this.number = queryResult.rows.length;
        this.content = queryResult.rows;
    }
}