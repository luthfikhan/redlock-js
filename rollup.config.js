const typescript = require('rollup-plugin-typescript2');

module.exports = [
  {
    input: 'src/index.ts',
    external: ["ioredis"],
    output: [
      {
        file: 'dist/redlock-js.esm.js',
        format: 'esm',
      },
      {
        file: 'dist/redlock-js.cjs.js',
        format: 'cjs',
      },
    ],
    plugins: [typescript()],
  },
];
