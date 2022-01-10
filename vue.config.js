let proxyObj = {};

proxyObj['/'] = {
    //websocket
    ws: false,
    //target address
    target: 'http://localhost:8081',
    //发送请求头的host会被设置为target
    changeOrigin: true,
    //不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
};

proxyObj['/ws'] = {
    ws: true,
    target: 'ws://localhost:8081'
};


//跨域：访问8080，通过代理node.js转发到8081端口
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
};