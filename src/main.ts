import {createServer} from "http";
import {Server as WebSocketServer} from "ws";
import {join} from "path";
import * as express from "express";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import {json, urlencoded} from "body-parser";
import {parse} from "url";

interface Options {
    port: number;
    rootPath: string;
    appPath: string;
}

export class Huge{
    protected port:number;
    protected rootPath:string;
    protected server:any = createServer();
    protected app:any = express();
    protected ws:any = new WebSocketServer({
        server: this.server,
        path: '/socket'
    });

    constructor(private options:Options) {
        this.port = options.port || 3000;
        this.rootPath = options.rootPath || __dirname;

        this.app.set('views', join(this.rootPath, 'views'));
        this.app.set('view engine', 'ejs');

        // uncomment after placing your favicon in /public
        //this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.app.use(logger('dev'));
        this.app.use(json());
        this.app.use(urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());

        this.app.use('/', (req:any, res:any, next:any) => {
            res.sendFile(this.rootPath + '/index.html');
        });

        // catch 404 and forward to error handler
        this.app.use((req:any, res:any, next:any) => {
            let err:any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers
        // console.log(app.get('env'));
        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err:any, req:any, res:any, next:any) => {
                res.status(err.status || 500);
                res.render('common/error', {
                    message: err.message,
                    error: err
                });
            });
        }

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

        // listen web socket
        this.ws.on('connection', (socket:any) => {
            var location = parse(socket.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            socket.on('message', (message:any) => {
                console.log('received: %s', message);
            });

            socket.send('hello kian!');
        });

    }

    public start() {
        this.server.on('request', this.app);
        this.server.listen(this.port, () => {
            console.log('Listening on ' + this.server.address().port);
        });
    }
}
