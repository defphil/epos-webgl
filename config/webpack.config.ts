import * as merge from "webpack-merge";
import common from "./env/common";

function getConfig() {
    const env = process.env.NODE_ENV || "development";
    let envConfig = null;

    switch (env) {
        case "production":
            envConfig = require("./env/release").default;
            break;

        case "development":
        default:
            envConfig = require("./env/debug").default;
            break;
    }

    return merge.smart(common, envConfig);
}

export default getConfig;
