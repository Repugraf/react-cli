const path = require("path");
const packageJSON = require("./package.json");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExpractPlugin = require("mini-css-extract-plugin");
const Autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackConfig = (env) => ({
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
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
      "process.env.PRODUCTION": env.production || !env.development,
      "process.env.NAME": packageJSON.name,
      "process.env.VERSION": packageJSON.version
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [Autoprefixer()]
      }
    }),
    new MiniCssExpractPlugin({
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
      errors: false,
      errorDetails: false,
      warnings: false,
      publicPath: false,
      entrypoints: false
    }
  }
});

module.exports = webpackConfig;
