const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const validate = require("webpack-validator");
const parts = require("./libs/parts");
const pkg = require("./package.json");

const PATHS = {
  app: path.join(__dirname, "app"),
  style: [
    path.join(__dirname, "node_modules", "purecss"),
    path.join(__dirname, "app", "main.css")
  ],
  build: path.join(__dirname, "build")
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    style: PATHS.style,
    app: PATHS.app,
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: PATHS.build,
    filename: "[name].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack Demo"
    })
  ]
};

var config;

// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
  // Run the full build (npm run build).
  case "build":
  case "stats":
    config = merge(
      common,
      {
        devtool: "source-map",
        output: {
          path: PATHS.build,
          // Deploy to GitHub - not working...
          //publicPath: "/ReactHombrew/",
          filename: "[name].[chunkhash].js",
          // This is used for require.ensure. The setup
          // will work without, but this is useful to set.
          chunkFilename: "[chunkhash].js"
        },
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        "process.env.NODE_ENV",
        "production"
      ),
      parts.extractBundle({
        name: "vendor"
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
    );
    break;
  // Run the dev start (npm start).
  default:
    config = merge(
      common,
      {
        devtool: "source-map"
      },
      parts.setupCSS(PATHS.style),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
