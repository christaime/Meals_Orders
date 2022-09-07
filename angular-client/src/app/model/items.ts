import { Persistable } from "./persistable";
export class Items extends Persistable{
    code!: string;
    description!: string;
    price!: string;
}
