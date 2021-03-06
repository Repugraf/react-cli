const path = require("path");
const packageJSON = require("./package.json");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

/**
 * @typedef {{
 *  production?: string | boolean,
 *  [key: string]: string | boolean
 * }} ENV 
 */

/** 
 * @param {ENV} env
 * @returns { import("webpack").Configuration } 
 */
const webpackConfig = (env = {}) => ({
  mode: env.production ? "production" : "development",
  context: path.resolve(__dirname),
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.[chunkhash].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [Autoprefixer]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: "source-map-loader"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.MODE": env.production ? "production" : "development",
      "process.env.NAME": packageJSON.name,
      "process.env.VERSION": packageJSON.version
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [Autoprefixer()]
      }
    }),
    new ESLintPlugin({
      extensions: [
        "js",
        "jsx"
      ],
      fix: true
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[chunkhash].css"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: ".",
          noErrorOnMissing: true
        }
      ]
    })
  ],
  devServer: {
    publicPath: "/",
    historyApiFallback: true,
    open: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: false,
      publicPath: false,
      entrypoints: false
    }
  }
});

module.exports = webpackConfig;
