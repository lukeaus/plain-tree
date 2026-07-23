import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'build/index.js', format: 'cjs', exports: 'named' },
    { file: 'build/index.mjs', format: 'es' },
    {
      file: 'build/index.umd.js',
      format: 'umd',
      name: 'plainTree',
      exports: 'named'
    }
  ],
  plugins: [typescript({ tsconfig: './tsconfig.build.json' })]
};
