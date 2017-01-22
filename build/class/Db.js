"use strict";
const path_1 = require("path");
const lodash_1 = require("lodash");
const appPath = path_1.dirname(module.parent.parent.filename);
const modelPath = path_1.join(appPath, './model');
class Db {
    constructor(name) {
        console.log(module.parent.parent);
        this.modelName = name;
        try {
            let Model = require(path_1.join(modelPath, name))[lodash_1.upperFirst(name)];
            console.log(Model);
            console.log(new Model());
        }
        catch (e) {
        }
    }
}
exports.Db = Db;
