import {Schema, model} from "mongoose";
import {dirname, join} from "path";
import {upperFirst} from "lodash";

export class Model{
    protected name:string;
    protected schema:any = {};
    constructor(name:string) {
        console.log(this.schema);
        this.schema = new Schema(this.schema);
        return this.schema;
    }
}
