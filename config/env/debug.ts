import * as webpack from "webpack";
import { resolve } from "path";

const appPath = process.cwd();

const devConfig = {
    mode: "development",

    output: {
        path: resolve(appPath, "target/debug"),
        filename: "[name].js"
    },

    devtool: "#cheap-inline-module-source-map",

    devServer: {
        // Enable HMR on the dev server
        hot: true,

        // Match the output path
        contentBase: resolve(appPath, "target/debug"),

        // Match the output `publicPath`
        publicPath: "/",

        host: "localhost",

        port: 4000,

        historyApiFallback: true,

        stats: {
            colors: true,
            hash: false,
            version: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false
        }
    },

    plugins: [
        // Enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // Prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin()
    ]
};

export default devConfig;
