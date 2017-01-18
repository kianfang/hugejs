import * as express from "express";
import {join, sep} from "path";
import {cloneDeep, indexOf} from "lodash";
import {} from "fs";

let router = express.Router();

router.all(["/:M/:C/:A/\*", "/:M/:C/:A", "/:M/:C", "/:M", "/"], (req: any, res: any, next: any) => {
    let _config = cloneDeep(req._config);

    console.log(_config.router.defaultModule);

    req._module = req.params.M || _config.router.defaultModule;
    req._controller = req.params.C || _config.router.defaultController;
    req._action = req.params.A || _config.router.defaultAction;

    console.log([req._module, req._controller, req._action, req.params]);

    // 判断请求模块是否存在
    if (indexOf(_config.modules, req._module) === -1) {
        // 若不存在， 则设置默认模块为当前模块， 并重构params[0] 值
        req._action = req._controller;
        req._controller = req._module;
        req._module = _config.router.defaultModule;

        // console.log(req.params);
        if (req.params.A) {
            req.params[0] = req.params[0] === undefined ? req.params.A : req.params.A + '/' + req.params[0];
        }
    }

    // 解析路径键/值对参数
    if (req.params[0]) {
        var pathParam = req.params[0].split(sep);
        if (pathParam[0] !== '') {
            for (var i = 0; i < pathParam.length; i += 2) {
                if (req.params[pathParam[i]]) {
                    next();
                    return;
                }
                req.params[pathParam[i]] = pathParam[i + 1] || null; //将路径参数添加到params中
            }
        }
    }

    console.log([req._module, req._controller, req._action, req.params]);

    res.render('index');
    // res.sendFile(_config.path.rootPath + '/index.html');
});

export {router};
