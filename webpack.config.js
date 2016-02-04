"use strict";

var path = require('path'), join = path.join.bind(path, __dirname);
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var lifecycle = process.env['npm_lifecycle_event'];
var isPrepublish = lifecycle === 'prepublish';
var isKarma = process.env['NODE_ENV'] === 'test';
var isTestDist = lifecycle === 'test-dist';

var config = {
    devtool: (isPrepublish ? '#source-map' : "#inline-source-map"),
    devServer: {
        noInfo: true,
        hot: true,
        inline: true,
        contentBase: join('public'),
        publicPath: '/',
        port: 8082
    },
    resolve: {
        extensions: ['', '.jsx', '.js'],
        alias: {
            'fbjs': join('node_modules/fbjs'),
            'react': join('node_modules/react'),
            'Subschema': join('node_modules/subschema/src'),
            'subschema': join('node_modules/subschema/src'),
            'subschema-styles': join('node_modules/subschema/src/styles'),


            'subschema-injection': isTestDist ? join('dist/index.js') : join('src/index.js')
        }
    },
    stats: {
        colors: true,
        reasons: true
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                //do this to prevent babel from translating everything.
                loader: 'babel',
                include: [
                    join('src'),
                    join('public'),
                    isKarma ? join('test') : join('no_such_dir'),
                    join('node_modules/subschema-test-support/src'),
                    join('node_modules/subschema/src')
                ]
            },
            {test: /\.(png|jpe?g|mpe?g[34]?|gif)$/, loader: 'url-loader?limit=100000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: 'style!css!' + AUTOPREFIXER_LOADER
            },
            {
                test: /\.less$/,
                loader: 'style!css!less!' + AUTOPREFIXER_LOADER
            }]

    },
    externals: (isPrepublish ? [{
        'react': true,
        'Subschema': true
    }] : null)
};

module.exports = config;