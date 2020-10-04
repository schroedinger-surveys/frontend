const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/v1',
        createProxyMiddleware({
            target: 'https://schroedinger-survey.de',
            changeOrigin: true
        })
    );
    app.use(
        '/api/v2',
        createProxyMiddleware({
            target: 'https://schroedinger-survey.de',
            changeOrigin: true,
            ws: true
        })
    )
};