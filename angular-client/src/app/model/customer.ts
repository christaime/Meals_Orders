import { Persistable } from "./persistable";

export class Customer extends Persistable{
    constructor(code?:string,name?:string){
        super();
        this.code = code? code : '';
        this.name = name? name : '';
        this.address = '',
        this.email = '',
        this.phone = '';
    }
    address!: string;
    code!: string;
    email!: string;
    gender!: string;
    name!:  string;
    phone!:  string;

    /*public static getEditionData(customer:any):{id:string,code: string,name: string, address: string, email: string, phone: string}{
        return (customer as {id:string,code: string,name: string, address: string, email: string, phone: string});
    }*/
}

export enum Gender {
    FEMALE,
    MALE,
}
