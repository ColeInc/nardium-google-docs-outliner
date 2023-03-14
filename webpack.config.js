const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CacheLoader } = require("cache-loader");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
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
                use: [
                    {
                        loader: "cache-loader",
                        options: {
                            cacheDirectory: path.resolve(__dirname, "node_modules/.cache/cache-loader"),
                        },
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "manifest.json", to: "../manifest.json" }],
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
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
