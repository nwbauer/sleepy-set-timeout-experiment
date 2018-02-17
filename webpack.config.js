const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: 'js/[name].js?[chunkhash:20]',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    contentBase: './build'
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      filename:'./index.html',
    })
  ]
}