import { defineConfig } from 'vitest/config';

export default defineConfig({
  appType: 'mpa',
  test: {
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**']
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        demo: 'demo/index.html',
        privacy: 'privacy/index.html',
        terms: 'terms/index.html',
        notFound: '404.html'
      }
    }
  }
});
