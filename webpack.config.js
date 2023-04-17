const path = require("path");
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
        filename: "content.js",
        path: path.resolve(__dirname, "dist"),
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
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "public/manifest.json", to: "manifest.json" }],
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

// resolve: {
//     extensions: [".tsx", ".ts", ".js"],
//     fallback: {
//         buffer: require.resolve("buffer/"),
//         https: require.resolve("https-browserify"),
//         url: require.resolve("url/"),
//         crypto: require.resolve("crypto-browserify"),
//         http2: require.resolve("http2"),
//         zlib: require.resolve("browserify-zlib"),
//         http: require.resolve("stream-http"),
//         net: require.resolve("net"),
//         tls: require.resolve("tls"),
//         fs: false,
//         child_process: false,
//     },
// },
