const { createProxyMiddleware } =  require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/ym', { target: 'https://app.yieldmonitor.io', changeOrigin: true, pathRewrite: { '^/ym': ''}}));
}