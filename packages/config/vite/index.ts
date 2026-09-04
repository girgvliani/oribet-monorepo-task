import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

interface CreateViteConfigOptions {
  root: string
  appName?: string
}

export function createViteConfig({ root, appName }: CreateViteConfigOptions): UserConfig {
  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [
            [
              'babel-plugin-styled-components',
              {
                displayName: true,
                fileName: true,
                namespace: appName || 'oribet'
              }
            ]
          ]
        }
      }),
      tsconfigPaths({ root }),
      svgr()
    ],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      // No production source maps — keeps original source out of the public bundle.
      sourcemap: false
    },
    define: {
      // Provide empty process.env for CRA compatibility during migration
      'process.env': {}
    }
  })
}

export { defineConfig, react, tsconfigPaths, svgr }
