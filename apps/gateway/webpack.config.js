const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.GATEWAY_PORT || 4200;
const MFE_PRODUCT_URL = process.env.MFE_PRODUCT_URL || 'http://localhost:4201';
const MFE_CART_URL = process.env.MFE_CART_URL || 'http://localhost:4202';

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: PORT,
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  output: {
    publicPath: '/',
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
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
      'process.env.MFE_PRODUCT_URL': JSON.stringify(MFE_PRODUCT_URL),
      'process.env.MFE_CART_URL': JSON.stringify(MFE_CART_URL)
    }),
    new ModuleFederationPlugin({
      name: 'gateway',
      remotes: {
        mfe_product: `mfe_product@${MFE_PRODUCT_URL}/remoteEntry.js`,
        mfe_cart: `mfe_cart@${MFE_CART_URL}/remoteEntry.js`
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
