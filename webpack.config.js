const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
    mode: "development",
    entry: {
        content: "./src/index.tsx",
        background: "./src/background.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "",
    },

    module: {
        rules: [
            {
                test: /\.txt$/,
                use: "raw-loader",
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
        modules: ["src", "node_modules"],
        fallback: {
            fs: false,
            os: false,
            tls: false,
            net: false,
            path: false,
            zlib: false,
            http: false,
            https: false,
            stream: false,
            crypto: false,
            child_process: false,
            http2: false,
            "crypto-browserify": require.resolve("crypto-browserify"),
            timers: require.resolve("timers-browserify"),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: "react"
        }),
        new CopyPlugin({
            patterns: [
                { from: "public/manifest.json", to: "manifest.json" },
                { from: "public/assets/icon16.png", to: "icon16.png" },
                { from: "public/assets/icon48.png", to: "icon48.png" },
                { from: "public/assets/icon128.png", to: "icon128.png" },
            ],
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new Dotenv(),
    ],
    devServer: {
        static: path.join(__dirname, "dist"),
        port: 3000,
    },
};
