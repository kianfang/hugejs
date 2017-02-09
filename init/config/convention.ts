export const convention:any = {
    debug: false,
    modules: [],
    server: {
        port: 3000,
    }, // 存储服务端配置
    socket: {
        open: false,
        path: '/socket'
    },
    // 存储初始化路径
    path: {
        _appPath: 'app',
        _viewPath: 'views',
        _controllerPath: 'controller',
        _modelPath: 'model',
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
}
