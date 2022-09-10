import { Persistable } from "./persistable";
export class Item extends Persistable{
    code!: string;
    description!: string;
    price!: string;
}
