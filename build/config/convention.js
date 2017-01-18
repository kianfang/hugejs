"use strict";
exports.convention = {
    debug: false,
    server: {
        port: 3000,
    },
    socket: {
        open: false,
        path: '/socket'
    },
    path: {
        _appPath: 'app',
        _viewPath: 'views',
        _staticPath: 'static',
        _filePath: 'file'
    },
    view: {
        engine: 'ejs'
    },
    router: {
        defaultModule: 'index',
        defaultController: 'index',
        defaultAction: 'index',
    }
};
