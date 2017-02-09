import * as express from "express";
import {join, sep} from "path";
import {cloneDeep, indexOf, forEach, chunk, fromPairs, defaultTo, upperFirst, isString} from "lodash";
import {} from "fs";

let router = express.Router();

router.all(["/:M/:C/:A/\*", "/:M/:C/:A", "/:M/:C", "/:M", "/"], (req: any, res: any, next: any) => {
    let _config = cloneDeep(req._config);

    // console.log(_config.router.defaultModule);
    // 获取 module controller action 名
    req._module = defaultTo(req.params.M, _config.router.defaultModule);
    req._controller = defaultTo(req.params.C, _config.router.defaultController);
    req._action = defaultTo(req.params.A, _config.router.defaultAction);

    // console.log([req._module, req._controller, req._action, req.params]);

    // 判断请求模块是否存在
    if (indexOf(_config.modules, req._module) === -1) {
        // 若不存在， 则设置默认模块为当前模块， 并重构params[0] 值
        req._action = req._controller;
        req._controller = req._module;
        req._module = _config.router.defaultModule;

        // console.log(req.params);
        if (req.params.A) {
            req.params[0] = req.params[0] === undefined ? req.params.A : `${req.params.A}/${req.params[0]}`;
        }
    }

    // 解析路径键/值对参数
    if (req.params[0]) {
        req.params.info = fromPairs(chunk(req.params[0].split(sep), 2));
    }

    // console.log(req.params.info);

    // 获取控制器路径
    const controllerPath = join(_config.path.controllerPath, req._module, req._controller);
    try {
        // 获取控制器模块
        let Controller = require(controllerPath)[upperFirst(req._controller)];
        let controller = new Controller(req, res, next);
        let result = controller[req._action](...[req.params.info]);

        if(!result) {
            return true;
        } else {
            if(isString(result)) {
                res.send(result);
                return true;
            } else {
                next();
            }
        }
    } catch(e) {
        e.message = `无法访问控制器（${controllerPath}）`;
        e.status = 404;
        next(e);
    }

});

export {router};
