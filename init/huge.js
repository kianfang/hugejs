"use strict";
const http_1 = require("http");
const ws_1 = require("ws");
const path_1 = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const body_parser_1 = require("body-parser");
const url_1 = require("url");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const MobileDetect = require("mobile-detect");
const router_1 = require("./lib/router");
const convention_1 = require("./config/convention");
class Huge {
    constructor(options) {
        this.options = options;
        this.server = http_1.createServer();
        this.app = express();
        this.config = lodash_1.defaultsDeep({}, options, convention_1.convention);
        this.config.path.rootPath = lodash_1.defaultTo(this.config.path.rootPath, path_1.dirname(module.parent.filename));
        this.config.path.staticPath = path_1.join(this.config.path.rootPath, this.config.path._staticPath);
        this.config.path.filePath = path_1.join(this.config.path.rootPath, this.config.path._filePath);
        this.config.path.faviconPath = path_1.join(this.config.path.rootPath, this.config.path._faviconPath);
        this.config.path.appPath = path_1.join(this.config.path.rootPath, this.config.path._appPath);
        this.config.path.viewPath = path_1.join(this.config.path.appPath, this.config.path._viewPath);
        this.config.path.controllerPath = path_1.join(this.config.path.appPath, this.config.path._controllerPath);
        this.config.path.modelPath = path_1.join(this.config.path.appPath, this.config.path._modelPath);
        if (lodash_1.isEmpty(this.config.modules)) {
            fs_1.readdir(this.config.path.appPath, (err, files) => {
                if (err) {
                    console.log('Not modules');
                }
                else {
                    lodash_1.forEach(files, (file) => {
                        let filepath = path_1.join(this.config.path.appPath, file);
                        fs_1.stat(filepath, (err, stats) => {
                            if (stats.isDirectory()) {
                                this.config.modules.push(file);
                            }
                        });
                    });
                }
            });
        }
        if (this.config.socket.open)
            this.initialSocket();
        this.initialApp();
    }
    initialApp() {
        this.app.set("x-powered-by", false);
        if (this.config.path._faviconPath)
            this.app.use(favicon(this.config.path.faviconPath));
        this.app.set('views', this.config.path.viewPath);
        this.app.set('view engine', this.config.view.engine);
        this.app.use(logger('dev'));
        this.app.use(body_parser_1.json());
        this.app.use(body_parser_1.urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());
        this.app.use('/statics', express.static(this.config.path.staticPath));
        this.app.use('/files', express.static(this.config.path.filePath));
        this.app.use((req, res, next) => {
            req._config = this.config;
            var md = new MobileDetect(req.headers['user-agent']);
            if (md.mobile()) {
                req._isMobile = true;
                req._terminalType = 'mobile';
            }
            else {
                req._isMobile = false;
                req._terminalType = 'pc';
            }
            next();
        });
        this.app.use('/', router_1.router);
        this.app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        if (this.config.debug) {
            this.app.use((err, req, res, next) => {
                res.status(lodash_1.defaultTo(err.status, 500));
                res.render('common/error', {
                    message: err.message,
                    error: err
                });
            });
        }
        this.app.use((err, req, res, next) => {
            res.status(lodash_1.defaultTo(err.status, 500));
            res.render(err.status === 404 ? 'common/404' : 'common/error', {
                message: err.message,
                status: 404
            });
        });
    }
    initialSocket() {
        this.ws = new ws_1.Server({
            server: this.server,
            path: this.config.socket.path
        });
        this.ws.on('connection', (socket) => {
            var location = url_1.parse(socket.upgradeReq.url, true);
            socket.on('message', (message) => {
                socket.send('received:' + message);
            });
            socket.send('hello kian!');
        });
    }
    start() {
        this.server.on('request', this.app);
        this.server.listen(this.config.server.port, () => {
            console.log('Listening on ' + this.server.address().port);
        });
    }
}
exports.Huge = Huge;
