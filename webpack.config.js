const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
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
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            buffer: require.resolve("buffer/"),
            https: require.resolve("https-browserify"),
            url: require.resolve("url/"),
            crypto: require.resolve("crypto-browserify"),
            http2: require.resolve("http2"),
            zlib: require.resolve("browserify-zlib"),
            http: require.resolve("stream-http"),
            net: require.resolve("net"),
            tls: require.resolve("tls"),
            fs: false,
            child_process: false,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        static: path.join(__dirname, "dist"),
        // compress: true,
        port: 3000,
    },
};

// module.exports = {
//     resolve: {
//         fallback: {
//             buffer: require.resolve("buffer/"),
//             https: require.resolve("https-browserify"),
//             url: require.resolve("url/"),
//             crypto: require.resolve("crypto-browserify"),
//         },
//     },
// };

// module.exports = {
//     resolve: {
//         fallback: {
//             buffer: false,
//             https: false,
//             url: false,
//             crypto: false,
//         },
//     },
// };
