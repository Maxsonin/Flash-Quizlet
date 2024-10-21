import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      input: {
        service_worker: './src/service_worker.ts', 
        content_scripts: './src/content_scripts.ts', 
        main: './index.html', 
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
