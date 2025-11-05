import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/franciscoArizagaluque/', // ¡URL ABSOLUTA de tu repo!
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
