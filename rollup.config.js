import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import html from 'rollup-plugin-fill-html';
import stylus from 'svelte-preprocess/src/processors/stylus';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'app/index.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'taotie',
    file: production ? 'public/[hash].js' : 'public/index.js',
    globals: {
    },
  },
  external: [
  ],
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      emitCss: false,
      legacy: true,
      preprocess: [stylus({
        'include css': true,
      })],
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      mainFields: ['svelte', 'module', 'main'],
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev)
    production && babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.svelte'],
    }),

    production && uglify(),

    html({
      template: 'app/index.html',
      filename: 'index.html',
    }),
  ],
};
