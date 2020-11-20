var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const { nanoid } = require('nanoid')

module.exports = env => {

  const COMPRESSION = true
  const ENVIRONMENT = 'production'

  console.log('\n\n webpack: webpack.production.js')
  console.log(` webapp_env: ${ENVIRONMENT}`)
  console.log(` webapp_compression: ${COMPRESSION}\n\n`)

  const entry = path.resolve(__dirname, 'dist', 'webapp', 'prod', 'index.html')
  const htmlTemplate = path.resolve(__dirname, "src", 'webapp', 'prod.html')
  
  return {
    mode: 'production',
    entry: [
      require.resolve(path.resolve(__dirname, "src", 'webapp', 'polyfills')),
      './src/webapp/App.tsx'
    ],
    output: {
      publicPath: '/app',
      path: path.resolve(__dirname, 'dist', 'webapp', 'prod', 'app'),
      filename: "app.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    stats: { 
      children: false,
      warnings: false
    },
    optimization: {
      minimize: true,
      moduleIds: 'hashed'
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        template: htmlTemplate,
        filename: entry
      }),
      new webpack.DefinePlugin({
        'process.env.WEBAPP_ENV': ENVIRONMENT,
        'process.env.WEBAPP_COMPRESSION': COMPRESSION
      }),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.7
      }),
      new BrotliPlugin({
        filename: '[path].br[query]',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.7
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '_BUILD_',
          replacement: nanoid(8)
        }
      ])
    ]
  }
}
