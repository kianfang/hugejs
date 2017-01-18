"use strict";
const express = require("express");
const path_1 = require("path");
const lodash_1 = require("lodash");
let router = express.Router();
exports.router = router;
router.all(["/:M/:C/:A/\*", "/:M/:C/:A", "/:M/:C", "/:M", "/"], (req, res, next) => {
    let _config = lodash_1.cloneDeep(req._config);
    console.log(_config.router.defaultModule);
    req._module = req.params.M || _config.router.defaultModule;
    req._controller = req.params.C || _config.router.defaultController;
    req._action = req.params.A || _config.router.defaultAction;
    console.log([req._module, req._controller, req._action, req.params]);
    if (lodash_1.indexOf(_config.modules, req._module) === -1) {
        req._action = req._controller;
        req._controller = req._module;
        req._module = _config.router.defaultModule;
        if (req.params.A) {
            req.params[0] = req.params[0] === undefined ? req.params.A : req.params.A + '/' + req.params[0];
        }
    }
    if (req.params[0]) {
        var pathParam = req.params[0].split(path_1.sep);
        if (pathParam[0] !== '') {
            for (var i = 0; i < pathParam.length; i += 2) {
                if (req.params[pathParam[i]]) {
                    next();
                    return;
                }
                req.params[pathParam[i]] = pathParam[i + 1] || null;
            }
        }
    }
    console.log([req._module, req._controller, req._action, req.params]);
    res.render('index');
});
