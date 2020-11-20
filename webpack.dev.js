var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const { nanoid } = require('nanoid')

module.exports = env => {

  const COMPRESSION = 'false'
  const ENVIRONMENT = 'dev'

  console.log('\n\n webpack: webpack.dev.js')
  console.log(` webapp_env: ${ENVIRONMENT}`)
  console.log(` webapp_compression: ${COMPRESSION}\n\n`)

  const entry = path.resolve(__dirname, 'dist', 'webapp', 'dev', 'index.html')

  let plugins = [
    new HtmlWebpackPlugin({
        hash: true,
        template: path.resolve(__dirname, "src", 'webapp', 'dev.html'),
        filename: entry
    }),
    new webpack.DefinePlugin({
      'process.env.WEBAPP_ENV': JSON.stringify(ENVIRONMENT),
      'process.env.WEBAPP_COMPRESSION': JSON.stringify(COMPRESSION)
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: '_BUILD_',
        replacement: nanoid(8)
      }
    ])
  ]
  
  if (COMPRESSION === 'true') {
    plugins = plugins.concat([
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
      })
    ])
  }

  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
      require.resolve(path.resolve(__dirname, "src", 'webapp', 'polyfills')),
      './src/webapp/App.tsx'
    ],
    output: {
      publicPath: '/app',
      path: path.resolve(__dirname, 'dist', 'webapp', 'dev', 'app'),
      filename: "app.dev.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.ts|\.tsx$/,
          loader: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    stats: 'errors-only',
    plugins
  }
}
