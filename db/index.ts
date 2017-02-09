import {Schema, model, createConnection} from "mongoose";
import {dirname, join} from "path";
import {upperFirst} from "lodash";

const controllerPath = dirname(module.parent.filename);
const appPath = join(controllerPath, '../../');
const modelPath = join(appPath, 'schema');

console.log(modelPath);

export class Db{
    protected modelName:string;
    protected schema:any = {};
    protected model:any = {};
    protected config:any = {};
    constructor(name:string) {
        console.log(name);
        this.modelName = upperFirst(name);
        try{
            let schema = require(join(modelPath, name)).schema;
            console.log(schema);
            this.schema = new Schema(schema);
            this.config = require(join(appPath, 'database'))['database'];

            let db = createConnection(this.config.host, this.config.name, this.config.port);

            db.on('error', console.error.bind(console,'连接错误:'));
            db.once('open',function(e){
                //一次打开记录
                console.log('connect mongod');
            });

            this.model = db.model(this.modelName, this.schema);
        }catch(e){
            // return false;
        }
    }

    public add(title, callback){
        let Entity=new this.model();
        Entity.title=title;
        Entity.save(function(err){
            if(err){
                console.log(err);
                callback(err);
            }else{
                callback(null);
            }
        });
    }
}
