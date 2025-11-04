import { Object, Property } from 'fabric-contract-api';
import { v4 as uuidv4 } from "uuid";
export type UUID = string & { readonly __uuidBrand: unique symbol };


@Object()
export class Vote {             
    @Property()
    public electionID: string;      
    
    @Property()
    public tav: string;

    @Property()
    public option: UUID;

    constructor() {
        this.option = uuidv4() as UUID;
    }
}