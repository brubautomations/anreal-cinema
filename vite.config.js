import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    if (mode === 'production') {
        console.log('🚀 Building for Production | Anreal Cinema');
    }

    return {
        plugins: [react()],
    };
});
