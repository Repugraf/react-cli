import path from "path";
import packageJSON from "./package.json";
import webpack, { Configuration } from "webpack";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Autoprefixer from "autoprefixer";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

type ENV = {
  production?: string | boolean
  [key: string]: string | boolean
};

const webpackConfig = (env: ENV = {}): Configuration => ({
  mode: env.production ? "production" : "development",
  context: path.resolve(__dirname),
  entry: path.resolve(__dirname, "src", "index.tsx"),
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.[chunkhash].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        },
        exclude: /build/
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
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.{ts,tsx,js,jsx}",
        enabled: true,
        options: {
          fix: true
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [Autoprefixer()]
      }
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[chunkhash].css"
    }),
    new CopyPlugin({
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

export default webpackConfig;
