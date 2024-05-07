const path = require('path')
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProduction = process.env.NODE_ENV === 'production'
const isSSR = !!process.env.SSR_MODE

let styleLoader
if (isProduction) {
  styleLoader = MiniCssExtractPlugin.loader
} else {
  styleLoader = 'vue-style-loader'
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['tailwindcss', 'autoprefixer']
    }
  }
}

const webpackPreprocessorLoader = {
  loader: 'webpack-preprocessor-loader',
  options: {
    params: {
      SSR_MODE: isSSR,
      ENGINE_STYLES_IN_JS: !!process.env.ENGINE_STYLES_IN_JS
    }
  }
}

const plugins = [
  new VueLoaderPlugin(),
  new Dotenv(),
  new webpack.DefinePlugin({
    'process.env.SSR_MODE': isSSR,
    'process.env.PROJECT': JSON.stringify(process.env.PROJECT)
  })
]

if (isProduction) {
  plugins.push(new MiniCssExtractPlugin({ filename: '[name].[hash:8].css' }))
}

module.exports = {
  devtool: isProduction ? false : 'source-map',
  optimization: isProduction
    ? {
        minimizer: [
          '...',
          new CssMinimizerPlugin({
            minimizerOptions: {
              preset: ['default', { colormin: false }]
            }
          })
        ]
      }
    : {},
  output: {
    path: path.resolve('./dist/'),
    filename: '[name].[hash:8].js',
    publicPath: '/dist/'
  },
  mode: isProduction ? 'production' : 'development',
  resolve: {
    extensions: ['.mjs', '.js', '.vue'],
    alias: {
      vue: path.resolve('./node_modules/vue'),
      'vue-router': path.resolve('./node_modules/vue-router'),
      'vuetify/lib/styles': path.resolve('./node_modules/vuetify/lib/styles'),
      'vuetify/iconsets/mdi-svg': path.resolve('./node_modules/vuetify/lib/iconsets/mdi-svg.mjs'),
      'vuetify/labs/VDataTable': path.resolve('./node_modules/vuetify/lib/labs/VDataTable'),
      'vuetify/framework': path.resolve('./node_modules/vuetify/lib/framework.mjs'),
      'vuetify/components': path.resolve('./node_modules/vuetify/lib/components'),
      'vuetify/directives': path.resolve('./node_modules/vuetify/lib/directives'),
      'vuetify/composables': path.resolve('./node_modules/vuetify/lib/composables'),
      'number-abbreviate': path.resolve('./node_modules/number-abbreviate'),
      lodash: path.resolve('./node_modules/lodash'),
      'js-cookie': path.resolve('./node_modules/js-cookie'),
      'is-mobile': path.resolve('./node_modules/is-mobile'),
      axios: path.resolve('./node_modules/axios'),
      '@xcode/icons': path.resolve('./node_modules/@xcode/icons'),
      '@xcode/ui-kit': path.resolve('./node_modules/@xcode/ui-kit'),
      '@vue/babel-helper-vue-transform-on': path.resolve(
        './node_modules/@vue/babel-helper-vue-transform-on'
      )
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [styleLoader, 'css-loader', postcssLoader]
      },
      {
        test: /\.(sass|scss)$/,
        use: [styleLoader, 'css-loader', postcssLoader, 'sass-loader', webpackPreprocessorLoader]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader', webpackPreprocessorLoader]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', webpackPreprocessorLoader]
      },
      {
        test: /\.(png|webp|svg|jpg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            esModule: false,
            outputPath: 'assets'
          }
        }
      }
    ]
  },
  plugins
}
