const fs = require('node:fs')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./base.js')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = merge(baseConfig, {
  target: ['web', 'es5'],
  entry: './app/entry.client.js',
  output: isProduction
    ? {
        clean: true
      }
    : {
        filename: '[name].js',
        publicPath: '/'
      },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.no-ssr.html',
      filename: 'index.html',
      inject: false
    })
  ]
})
