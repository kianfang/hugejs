"use strict";
const express = require("express");
const path_1 = require("path");
const lodash_1 = require("lodash");
let router = express.Router();
exports.router = router;
router.all(["/:M/:C/:A/\*", "/:M/:C/:A", "/:M/:C", "/:M", "/"], (req, res, next) => {
    let _config = lodash_1.cloneDeep(req._config);
    req._module = lodash_1.defaultTo(req.params.M, _config.router.defaultModule);
    req._controller = lodash_1.defaultTo(req.params.C, _config.router.defaultController);
    req._action = lodash_1.defaultTo(req.params.A, _config.router.defaultAction);
    if (lodash_1.indexOf(_config.modules, req._module) === -1) {
        req._action = req._controller;
        req._controller = req._module;
        req._module = _config.router.defaultModule;
        if (req.params.A) {
            req.params[0] = req.params[0] === undefined ? req.params.A : `${req.params.A}/${req.params[0]}`;
        }
    }
    if (req.params[0]) {
        req.params.info = lodash_1.fromPairs(lodash_1.chunk(req.params[0].split(path_1.sep), 2));
    }
    const controllerPath = path_1.join(_config.path.controllerPath, req._module, req._controller);
    try {
        let Controller = require(controllerPath)[lodash_1.upperFirst(req._controller)];
        let controller = new Controller(req, res, next);
        let result = controller[req._action]('test');
        if (!result) {
            return true;
        }
        else {
            if (lodash_1.isString(result)) {
                res.send(result);
                return true;
            }
            else {
                next();
            }
        }
    }
    catch (e) {
        e.message = `无法访问控制器（${controllerPath}）`;
        e.status = 404;
        next(e);
    }
});
