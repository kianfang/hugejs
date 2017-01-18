import {createServer} from "http";
import {Server as WebSocketServer} from "ws";
import {join} from "path";
import * as express from "express";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import {json, urlencoded} from "body-parser";
import {parse} from "url";
import {defaultsDeep} from "lodash";

// 终端判断模块
import * as MobileDetect from "mobile-detect";
import {router} from "./lib/router";
// 加载默认配置
import {convention as _config} from "./config/convention";

interface Options {
    debug:boolean,
    path:{
        rootPath:string,
        _appPath:string,
        _viewPath:string,
        _staticPath:string,
        _filePath:string
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
        if(!options.path.rootPath) throw new Error('options rootPath is exception');
        this.config = defaultsDeep({}, options, _config);
        // console.log(this.config);
        if(!this.config.path.rootPath) throw new Error('options rootPath is exception');
        this.config.path.appPath = join(this.config.path.rootPath, this.config.path._appPath);
        this.config.path.viewPath = join(this.config.path.rootPath, this.config.path._viewPath);
        this.config.path.staticPath = join(this.config.path.rootPath, this.config.path._staticPath);
        this.config.path.filePath = join(this.config.path.rootPath, this.config.path._filePath);
        // console.log(this.config);

        this.initialApp();
        if(this.config.socket.open) this.initialSocket();
    }

    private initialApp () {
        this.app.set("x-powered-by", false);

        this.app.set('views', this.config.path.viewPath);
        this.app.set('view engine', this.config.view.engine);
        // uncomment after placing your favicon in /public
        //this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
                res.status(err.status || 500);
                res.render('common/error', {
                    message: err.message,
                    error: err
                });
            });
        } else {
            // production error handler
            // no stacktraces leaked to user
            this.app.use((err:any, req:any, res:any, next:any) => {
                res.status(err.status || 500);
                res.render(err.status === 404 ? 'common/404':'common/error', {
                    message: err.message,
                    status: 404
                    // error: {}
                });
            });
        }

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
