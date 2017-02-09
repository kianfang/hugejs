import {Schema, model} from "mongoose";
import {dirname, join} from "path";
import {upperFirst} from "lodash";

export class Model{
    protected name:string;
    protected schema:any = {};
    protected config:any = {};
    constructor(name:string, conf:any) {
        this.name = name;
        this.config = conf;
        this.schema = new Schema(this.schema);

        return this;
    }
}
