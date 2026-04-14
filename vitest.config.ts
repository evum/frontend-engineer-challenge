import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
   resolve: {
    alias: [
      {
        find: /^@mui\/icons-material(\/.*)?$/,
        replacement: path.resolve(__dirname, 'src/test/mocks/mui-icons-stub.ts'),
      },
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    typecheck: {
      tsconfig: './tsconfig.test.json',
    }
  },
});
