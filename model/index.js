"use strict";
const mongoose_1 = require("mongoose");
class Model {
    constructor(name, conf) {
        this.schema = {};
        this.config = {};
        this.name = name;
        this.config = conf;
        this.schema = new mongoose_1.Schema(this.schema);
        return this;
    }
}
exports.Model = Model;
