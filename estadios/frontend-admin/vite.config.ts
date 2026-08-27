import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Requerido para mapear puertos en Docker
        port: 3000,
    },
});