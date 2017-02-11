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
            // console.log(schema);
            this.schema = new Schema(schema);
            this.config = require(join(appPath, 'database'))['database'];

            let db = createConnection(this.config.host, this.config.name, this.config.port, {
                user: this.config.user,
                pass: this.config.password
            });

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

    public add(document):Promise<any> {
        let Entity=new this.model(document);
        // Entity.aaa=123;
        return new Promise((resolve, reject) => {
            Entity.save((err) => {
                if(err) {
                    console.log(err);
                    resolve({
                        error: -1,
                        data: err,
                        message: "add failed!"
                    });
                } else {
                    resolve({
                        error: 0,
                        data: Entity,
                        message: "find successfully!"
                    });
                }
            });
        });
    }

    public find(condition): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.find(condition, (err, documents) => {
                if(err) {
                    resolve({
                        error: -1,
                        data: err,
                        message: "find failed!"
                    });
                } else {
                    resolve({
                        error: 0,
                        data: documents,
                        message: "find successfully!"
                    });
                }
            });
        });

    }

    public remove(condition): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.remove(condition, (err) => {
                if(err) {
                    resolve({
                        error: -1,
                        data: err,
                        message: "remove failed!"
                    });
                } else {
                    resolve({
                        error: 0,
                        message: "remove successfully!"
                    });
                }
            })
        });
    }
}
