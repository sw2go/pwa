const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { env } = require("process");
const CopyPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  devtool: env.production ? "none" : "source-map",
  entry: {
    app: "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "../wwwroot"),
    clean: true,
    filename: (pathdata) => { 
      console.log(pathdata.chunk.name);
      return (pathdata.chunk.name === 'serviceworker') ? "[name].js" : "[name].[chunkhash].js" 
    },
    publicPath: "./",
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      { 
        test: /(\.(png|jpg|gif)|manifest.json|test.html)$/,   
        type: 'asset/resource'
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash].css",
    }),
    new CopyPlugin({                // to copy existing resources to dist
      patterns: [
        { from: "src/assets/*.*" , to: "assets/[name][ext]" },
        { from: "src/manifest.*" , to: "[name][ext]" },
        { from: "src/test.html" , to: "[name][ext]" },
      ],
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.ts',
      swDest: '../wwwroot/service-worker.js',
    })
    //new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
    //  clientsClaim: true,
    //  skipWaiting: true,
    //}),
  ],
};