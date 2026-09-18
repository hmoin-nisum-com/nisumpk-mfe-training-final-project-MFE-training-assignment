const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.MFE_CART_PORT || 4202;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: PORT,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true
  },
  output: {
    publicPath: `http://localhost:${PORT}/`,
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@ecommerce/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
      '@ecommerce/shared-ui': path.resolve(__dirname, '../../libs/shared-ui/src/index.ts'),
      '@ecommerce/events': path.resolve(__dirname, '../../libs/events/src/index.ts'),
      '@ecommerce/state': path.resolve(__dirname, '../../libs/state/src/index.ts'),
      '@ecommerce/utilities': path.resolve(__dirname, '../../libs/utilities/src/index.ts')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json')
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3000')
    }),
    new ModuleFederationPlugin({
      name: 'mfe_cart',
      filename: 'remoteEntry.js',
      exposes: {
        './CartView': './src/exposes/CartViewExport',
        './CartBadge': './src/exposes/CartBadgeExport'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1', eager: false },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1', eager: false },
        zustand: { singleton: true, eager: false },
        '@ecommerce/shared-types': { singleton: true, eager: false },
        '@ecommerce/shared-ui': { singleton: true, eager: false },
        '@ecommerce/events': { singleton: true, eager: false },
        '@ecommerce/state': { singleton: true, eager: false },
        '@ecommerce/utilities': { singleton: true, eager: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
