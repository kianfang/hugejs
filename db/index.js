"use strict";
const mongoose_1 = require("mongoose");
const path_1 = require("path");
const lodash_1 = require("lodash");
const controllerPath = path_1.dirname(module.parent.filename);
const appPath = path_1.join(controllerPath, '../../');
const modelPath = path_1.join(appPath, 'schema');
console.log(modelPath);
class Db {
    constructor(name) {
        this.schema = {};
        this.model = {};
        this.config = {};
        console.log(name);
        this.modelName = lodash_1.upperFirst(name);
        try {
            let schema = require(path_1.join(modelPath, name)).schema;
            console.log(schema);
            this.schema = new mongoose_1.Schema(schema);
            this.config = require(path_1.join(appPath, 'database'))['database'];
            let db = mongoose_1.createConnection(this.config.host, this.config.name, this.config.port);
            db.on('error', console.error.bind(console, '连接错误:'));
            db.once('open', function (e) {
                console.log('connect mongod');
            });
            this.model = db.model(this.modelName, this.schema);
        }
        catch (e) {
        }
    }
    add(title, callback) {
        let Entity = new this.model();
        Entity.title = title;
        Entity.save(function (err) {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
}
exports.Db = Db;
