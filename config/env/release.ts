import * as TerserPlugin from "terser-webpack-plugin";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import { resolve } from "path";

const appPath = process.cwd();

const prodConfig = {
    mode: "production",

    output: {
        path: resolve(appPath, "target/release"),
        filename: "[name].js"
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    ecma: 5,
                    warnings: false,
                    compress: {
                        drop_debugger: true,
                        drop_console: true,
                        conditionals: true,
                        evaluate: true,
                        sequences: true,
                        booleans: true,
                        unused: true
                    }
                }
            })
        ]
    },

    plugins: [
        new CleanWebpackPlugin(["target/release"], {
            root: appPath
        })
    ]
};

export default prodConfig;
