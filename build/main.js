"use strict";
const http_1 = require("http");
const ws_1 = require("ws");
const path_1 = require("path");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const body_parser_1 = require("body-parser");
const url_1 = require("url");
class Huge {
    constructor(options) {
        this.options = options;
        this.server = http_1.createServer();
        this.app = express();
        this.ws = new ws_1.Server({
            server: this.server,
            path: '/socket'
        });
        this.port = options.port || 3000;
        this.rootPath = options.rootPath || __dirname;
        this.app.set('views', path_1.join(this.rootPath, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(logger('dev'));
        this.app.use(body_parser_1.json());
        this.app.use(body_parser_1.urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());
        this.app.use('/', (req, res, next) => {
            res.sendFile(this.rootPath + '/index.html');
        });
        this.app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        if (this.app.get('env') === 'development') {
            this.app.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.render('common/error', {
                    message: err.message,
                    error: err
                });
            });
        }
        this.app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render(err.status === 404 ? 'common/404' : 'common/error', {
                message: err.message,
                status: 404
            });
        });
        this.ws.on('connection', (socket) => {
            var location = url_1.parse(socket.upgradeReq.url, true);
            socket.on('message', (message) => {
                console.log('received: %s', message);
            });
            socket.send('hello kian!');
        });
    }
    start() {
        this.server.on('request', this.app);
        this.server.listen(this.port, () => {
            console.log('Listening on ' + this.server.address().port);
        });
    }
}
exports.Huge = Huge;
