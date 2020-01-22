import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";

const appPath = process.cwd();

export default {
    context: appPath,

    entry: {
        main: resolve(appPath, "src/main.ts")
    },

    resolve: {
        extensions: [".js", ".ts"],
        mainFields: ["module", "main"]
    },

    watchOptions: {
        aggregateTimeout: 20
    },

    module: {
        rules: [
            {
                test: /\.ts/,
                use: "ts-loader",
                include: [
                    resolve(appPath, "src")
                ]
            },

            {
                test: /\.(vert|frag)/,
                use: "raw-loader"
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.HashedModuleIdsPlugin(),

        new HtmlWebpackPlugin({
            template: resolve(appPath, "src/resources/index.html"),
            minify: {
                collapseWhitespace: true
            }
        })
    ]
};
