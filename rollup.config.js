import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import path from 'path';
const DIST_DIR = path.join(__dirname, 'dist/');

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const NAME = 'promisePowerup';

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'] }),
  ],

  output: [
    {
      file: path.join(DIST_DIR, NAME + '.js'),
      format: 'umd',
      name: NAME,
      sourcemap: true
    }
  ],
};
