"use strict";
exports.convention = {
    debug: false,
    modules: [],
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
        _filePath: 'file',
        _faviconPath: ''
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
