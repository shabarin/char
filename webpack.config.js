const NODE_ENV = process.env.NODE_ENV || 'development';

var path = require('path');

var config = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    watch: NODE_ENV == 'development',
    watchOptions: { aggregateTimeout: 100 },

    devtool: NODE_ENV == 'development' ? 'source-map' : null,
};

module.exports = config;