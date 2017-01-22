"use strict";
const mongoose_1 = require("mongoose");
class Model {
    constructor(name) {
        this.schema = {};
        console.log(this.schema);
        this.schema = new mongoose_1.Schema(this.schema);
        return this.schema;
    }
}
exports.Model = Model;
