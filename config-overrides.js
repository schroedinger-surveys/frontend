module.exports = function override(config, env) {
    config.output = {
        ...config.output,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
    };
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
        cacheGroups: {
            default: false
        }
    };
    config.optimization.runtimeChunk = false;
    config.output.filename = 'static/js/[name].js';
    config.plugins[5].options.filename = 'static/css/[name].css';
    config.plugins[5].options.moduleFilename = () => 'static/css/main.css';
    return config;
};