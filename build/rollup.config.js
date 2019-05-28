import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const baseConfig = {
    input: 'src/entry.js',
    plugins: {
        preVue: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            commonjs(),
        ],
        vue: {
            css: true,
            template: {
                isProduction: true,
            },
        },
        postVue: [
            buble(),
        ],
    },
};

const external = [];
const globals = {};
const buildFormats = [];

if (!argv.format || argv.format === 'es') {
    const esConfig = {
        ...baseConfig,
        output: {
            file: 'dist/svg-vue.esm.js',
            format: 'esm',
            exports: 'named',
        },
        plugins: [
            ...baseConfig.plugins.preVue,
            vue(baseConfig.plugins.vue),
            ...baseConfig.plugins.postVue,
            terser({
                output: {
                    ecma: 6,
                },
            }),
        ],
    };
    buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
    const umdConfig = {
        ...baseConfig,
        external,
        output: {
            compact: true,
            file: 'dist/svg-vue.ssr.js',
            format: 'cjs',
            name: 'SvgVue',
            exports: 'named',
            globals,
        },
        plugins: [
            ...baseConfig.plugins.preVue,
            vue({
                ...baseConfig.plugins.vue,
                template: {
                    ...baseConfig.plugins.vue.template,
                    optimizeSSR: true,
                },
            }),
            ...baseConfig.plugins.postVue,
        ],
    };
    buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'iife') {
    const unpkgConfig = {
        ...baseConfig,
        external,
        output: {
            compact: true,
            file: 'dist/svg-vue.min.js',
            format: 'iife',
            name: 'SvgVue',
            exports: 'named',
            globals,
        },
        plugins: [
            ...baseConfig.plugins.preVue,
            vue(baseConfig.plugins.vue),
            ...baseConfig.plugins.postVue,
            terser({
                output: {
                    ecma: 5,
                },
            }),
        ],
    };
    buildFormats.push(unpkgConfig);
}

export default buildFormats;
