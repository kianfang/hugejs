import {Schema, model} from "mongoose";
import {dirname, join} from "path";
import {upperFirst} from "lodash";

const appPath = dirname(module.parent.parent.filename);

const modelPath = join(appPath, './model');
export class Db{
    protected modelName:string;
    constructor(name:string) {
        console.log(module.parent.parent);
        this.modelName = name;
        try{
            let Model = require(join(modelPath, name))[upperFirst(name)];
            console.log(Model);
            console.log(new Model());
        }catch(e){
            // return false;
        }
    }
}
