"use strict";
class Controller {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this._initailize();
    }
    _initailize() { }
    redirect(path) {
        this.res.redirect(path);
    }
    Db() {
    }
}
exports.Controller = Controller;
