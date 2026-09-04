import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // @oribet/ui is consumed as SOURCE, so without deduping the app's styled-components and the
  // copy the transformed ui source imports resolve to two module instances — two ThemeContexts,
  // and every themed component reads `theme` as undefined under test.
  resolve: { dedupe: ['styled-components', 'react', 'react-dom'] },
  // Vitest: these tests are CRA-era and rely on globals (`test`, `expect`) plus jsdom, neither
  // of which vitest enables by default — without this block every test file threw
  // "test is not defined".
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    server: { deps: { inline: [/@oribet\//] } },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: true,
              pure: true,
              minify: true,
              transpileTemplateLiterals: true,
              namespace: 'Oribet'
            }
          ]
        ]
      }
    }),
    tsconfigPaths(),
    svgr()
  ],
  resolve: {
    alias: {
      // Per-brand asset override (docs/overrides.md §2): oribet (efsobet) logo (full + mini).
      // Matches the written import specifier; applies to this build only.
      '@oribet/assets/logos/LogoMain': path.resolve(__dirname, 'src/assets/logos/LogoMain.tsx'),
      '@oribet/assets/logos/LogoMainMini': path.resolve(__dirname, 'src/assets/logos/LogoMainMini.tsx'),
      // Match existing craco.config.js aliases
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@server': path.resolve(__dirname, 'src/server'),
      '@utils': path.resolve(__dirname, 'src/util'),
      '@locale': path.resolve(__dirname, 'src/locale'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@lotties': path.resolve(__dirname, 'src/lotties'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@ui': path.resolve(__dirname, 'src/api/ui'),
      '@icons': path.resolve(__dirname, 'src/api/ui/svgIcons'),
      // Support non-prefixed types imports
      'types': path.resolve(__dirname, 'src/types')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    // No production source maps — keeps original source out of the public bundle.
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['redux', 'react-redux', '@reduxjs/toolkit']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['styled-components']
  },
  define: {
    // CRA uses process.env, Vite uses import.meta.env
    // This provides backward compatibility during migration
    'process.env': {}
  }
})
