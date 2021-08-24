import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import { ForkTsCheckerWebpackPlugin } from 'fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPlugin';

module.exports = env => {
    env = env || {};
    return {
        target: 'web',
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? false : 'cheap-module-source-map',
        resolve: {
            alias: {
                'Subway': path.resolve('./sources'),
            },
            extensions: ['.js', '.ts'],
        },
        entry: {
            subway: './sources/index.ts',
        },
        output: {
            publicPath: '/',
            path: path.resolve('./builds/web'),
            filename: env.production ? '[name].min.js' : '[name].js',
            pathinfo: false,
            library: 'Subway',
        },
        module: {
            rules: [{
                test: /.ts$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.web.json',
                    transpileOnly: true,
                },
            }],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
        ],
        optimization: {
            minimizer: env.production ? [ new TerserJSPlugin() ] : [],
        }
    };
};