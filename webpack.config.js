const webpack = require('webpack');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        loader: require.resolve('txt-loader'),
        test: /\.(vert|frag)$/,
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        }
      },
      {
        loader: require.resolve('url-loader'),
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        }
      }
    ]
  }
}
