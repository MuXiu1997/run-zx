import packageJson from './package.json'

// @ts-expect-error no types
import ncc from '@vercel/ncc'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

import fs from 'node:fs'
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
      fileName: (_, entryName) => `${entryName}.vite.mjs`,
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
    (() => {
      const outputs: string[] = []
      return {
        name: 'rollup-plugin-ncc',
        writeBundle(options, bundle) {
          outputs.push(...Object.keys(bundle).map(file => path.join(options.dir!, file)))
        },
        async closeBundle() {
          await Promise.all(
            outputs.filter(file => file.endsWith('.vite.mjs'))
              .map(async (file) => {
                const { code } = await ncc(file, {
                  minify: true,
                })
                await fs.promises.writeFile(file.replace(/\.vite\.mjs$/, '.mjs'), code)
              }),
          )
          await Promise.all(outputs.map(file => fs.promises.rm(file)))
        },
      } as import('vite').Plugin
    })(),
  ],
})
