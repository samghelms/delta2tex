 var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './delta2tex.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'delta2tex.min.js',
         library: 'delta2tex',
         libraryTarget: 'umd',
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
};