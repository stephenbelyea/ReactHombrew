const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

// Serve to localhost:8080 and enable live reload JS.
exports.devServer = function(options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: "errors-only",

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}

// Dynamically load CSS into generated index's head.
exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ["style", "css"],
          include: paths
        }
      ]
    }
  };
}

// Minification for JS.
exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        beatify: false,
        comments: false,
        compress: {
          warnings: false,
          drop_console: true
        },
        mangle: {
          // Maintain $ symbol, keep function names,
          // and don't bother with (screw) IE8.
          except: ["$"],
          keep_fnames: true,
          screw_ie8: true,
          // Don't mangle Webpack runtime.
          except: ["webpackJsonp"]
        }
      })
    ]
  }
}

// Compress JS further by setting free variables,
// explained pretty clearly here:
// http://survivejs.com/webpack/building-with-webpack/setting-environment-variables/#the-basic-idea-of-defineplugin-
exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
}

// Keep JS filesizes light by weeding out common chunks,
// including only once, and serving a manifest for ref.
exports.extractBundle = function(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest
      // is needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, "manifest"]
      })
    ]
  }
}

// Cleanup the build dir using clean-webpack-plugin.
exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without `root`, CleanWebpackPlugin won't point
        // to our project and will fail.
        root: process.cwd()
      })
    ]
  }
}
