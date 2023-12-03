import packageJson from './package.json'

import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '~': `${path.resolve(__dirname, 'src')}`,
      '#/': `${path.resolve(__dirname, 'test')}/`,
      '#': `${path.resolve(__dirname, 'test')}`,
    },
  },
  build: {
    minify: false,
    target: 'node20',
    reportCompressedSize: false,
    lib: {
      entry: ['src/main.ts', 'src/post.ts'],
      fileName: (_, entryName) => `${entryName}.mjs`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^node:/,
        ...Object.keys(packageJson.dependencies),
      ],
    },
  },
  plugins: [
    AutoImport({
      dirs: ['src/globals'],
      dts: true,
    }),
  ],
})
