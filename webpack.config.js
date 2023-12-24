const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        // background: path.resolve(__dirname, "src", "background.ts"),
        // popup: path.resolve(__dirname, "src", "popup.ts"),
        options: path.resolve(__dirname, "src", "options", "options.jsx")
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".jsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: ".",
                    to: ".",
                    context: "public"
                },
                {
                    from: path.resolve(__dirname, "public", "manifest.json"),
                    to: path.resolve(__dirname, "package.json"),
                    transform(content) {
                        const manifestConfig = JSON.parse(content);
                        const packageConfigPath = path.resolve(__dirname, "package.json");
                        const packageConfig = require(packageConfigPath);
                        packageConfig.name = manifestConfig.name.toLowerCase();
                        packageConfig.version = manifestConfig.version;
                        packageConfig.description = manifestConfig.description;
                        return JSON.stringify(packageConfig, null, 4);
                    }
                },
                {
                    from: path.resolve(__dirname, "public", "manifest.json"),
                    to: path.resolve(__dirname, "dist", "manifest.json"),
                    transform(content) {
                        const manifest = JSON.parse(content);
                        delete manifest.$schema;
                        return JSON.stringify(manifest, null, 4);
                    }
                }
            ]
        })
    ]
};
