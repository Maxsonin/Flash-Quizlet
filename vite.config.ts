import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      input: {
        background: './src/background.ts', 
        content: './src/content.ts', 
        main: './index.html', 
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
