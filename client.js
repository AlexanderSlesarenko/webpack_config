const fs = require('node:fs')
const { merge } = require('webpack-merge')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./base.js')

const isProduction = process.env.NODE_ENV === 'production'

const { PROJECT } = process.env

const loader = fs.readFileSync(require.resolve(`./${PROJECT}/loader.svg`), 'utf8')
const favicons = fs.readFileSync(require.resolve(`./${PROJECT}/favicons.txt`), 'utf8')
const title = PROJECT.charAt(0).toUpperCase() + PROJECT.slice(1)
const google = fs.readFileSync(require.resolve(`./${PROJECT}/google.txt`), 'utf8')

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
      inject: false,
      templateParameters: {
        loader,
        favicons,
        title,
        google
      }
    })
    // new BundleAnalyzerPlugin()
  ]
})
