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

    public getEditionData(){
        return {code: this.code,name: this.name, address: this.address, email: this.email, phone: this.phone};
    }
}

export enum Gender {
    FEMALE,
    MALE,
}
