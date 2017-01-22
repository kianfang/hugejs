export {Controller} from "./class/Controller";
export {Model} from "./class/Model";

import {createServer} from "http";
import {Server as WebSocketServer} from "ws";
import {join, dirname} from "path";
import * as express from "express";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import {json, urlencoded} from "body-parser";
import {parse} from "url";
import {readdir, stat} from "fs";
import {defaultsDeep, isEmpty, forEach, defaultTo} from "lodash";

// 终端判断模块
import * as MobileDetect from "mobile-detect";
import {router} from "./lib/router";
// 加载默认配置
import {convention as _config} from "./config/convention";

interface Options {
    debug:boolean,
    path:{
        rootPath:string,
        _staticPath:string,
        _filePath:string,
        _faviconPath:string,
        _appPath:string,
        _viewPath:string,
        _controllerPath:string,
        _modelPath:string
    },
    view: {
        engine:string
    },
    server: {
        port:number
    },
    socket: {
        open:boolean,
        path:string
    },
    router: {
        defaultModule:string
    },
    modules:string[]
}

export class Huge{
    protected port:number;
    protected server:any = createServer();
    protected app:any = express();
    protected ws:any;
    private config:any;

    protected _path:any;
    constructor(private options:Options) {
        // 确保rootPath存在
        // if(!options.path.rootPath) throw new Error('options rootPath is exception');
        this.config = defaultsDeep({}, options, _config);
        this.config.path.rootPath = defaultTo(this.config.path.rootPath, dirname(module.parent.filename));
        this.config.path.staticPath = join(this.config.path.rootPath, this.config.path._staticPath);
        this.config.path.filePath = join(this.config.path.rootPath, this.config.path._filePath);
        this.config.path.faviconPath = join(this.config.path.rootPath, this.config.path._faviconPath);

        this.config.path.appPath = join(this.config.path.rootPath, this.config.path._appPath);

        this.config.path.viewPath = join(this.config.path.appPath, this.config.path._viewPath);
        this.config.path.controllerPath = join(this.config.path.appPath, this.config.path._controllerPath);
        this.config.path.modelPath = join(this.config.path.appPath, this.config.path._modelPath);
        // console.log(this.config);

        if(isEmpty(this.config.modules)) {
            // 获取模块
            readdir(this.config.path.appPath, (err, files) => {
                if(err) {
                    console.log('Not modules');
                } else {
                    forEach(files, (file) => {
                        let filepath = join(this.config.path.appPath, file);
                        stat(filepath, (err, stats) => {
                            if(stats.isDirectory()) {
                                this.config.modules.push(file);
                            }
                        });
                    });
                }
            });
        }

        // 开启socket 通信
        if(this.config.socket.open) this.initialSocket();
        // 开始应用
        this.initialApp();
    }

    private initialApp () {
        this.app.set("x-powered-by", false);
        // uncomment after placing your favicon in /public
        if(this.config.path._faviconPath) this.app.use(favicon(this.config.path.faviconPath));
        //设置视图
        this.app.set('views', this.config.path.viewPath);
        this.app.set('view engine', this.config.view.engine);
        //解析消息头
        this.app.use(logger('dev'));
        this.app.use(json());
        this.app.use(urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());

        // 静态文件
        this.app.use('/statics', express.static(this.config.path.staticPath));
        this.app.use('/files', express.static(this.config.path.filePath));

        // 初始化配置
        this.app.use((req:any, res:any, next:any) => {
            req._config = this.config;
            var md = new MobileDetect(req.headers['user-agent']);
            if (md.mobile()) {
                req._isMobile = true;
                req._terminalType = 'mobile';
            } else {
                req._isMobile = false;
                req._terminalType = 'pc';
            }
            next();
        });
        // 转跳路由
        this.app.use('/', router);
        // catch 404 and forward to error handler
        this.app.use((req:any, res:any, next:any) => {
            let err:any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        if (this.config.debug) {
            // error handlers
            // console.log(app.get('env'));
            // development error handler
            // will print stacktrace
            // if (this.app.get('env') === 'development') {
            this.app.use((err:any, req:any, res:any, next:any) => {
                res.status(defaultTo(err.status, 500));
                res.render('common/error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        this.app.use((err:any, req:any, res:any, next:any) => {
            res.status(defaultTo(err.status, 500));
            res.render(err.status === 404 ? 'common/404':'common/error', {
                message: err.message,
                status: 404
                // error: err
            });
        });

    }

    private initialSocket () {
        this.ws = new WebSocketServer({
            server: this.server,
            path: this.config.socket.path
        });

        // listen web socket
        this.ws.on('connection', (socket:any) => {
            var location = parse(socket.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            socket.on('message', (message:any) => {
                socket.send('received:' + message);
            });

            socket.send('hello kian!');
        });
    }

    public start() {
        this.server.on('request', this.app);
        this.server.listen(this.config.server.port, () => {
            console.log('Listening on ' + this.server.address().port);
        });
    }
}
