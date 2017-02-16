var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './js/index.js',
    devtool: 'sourcemap',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, 'js'),
            loader: 'babel'
        }]
    }
};
