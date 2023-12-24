const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        background: path.resolve(__dirname, "src", "background.ts"),
        popup: path.resolve(__dirname, "src", "popup.ts")
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
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
