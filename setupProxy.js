const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/v1',
        createProxyMiddleware({
            target: 'https://192.168.2.125:3000',
            changeOrigin: true
        })
    );
};