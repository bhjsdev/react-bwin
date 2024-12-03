import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	root: './dev',
	envDir: '../',
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		lib: {
			entry: '../src/index.tsx',
			formats: ['es'],
			name: 'ReactBinaryWindow',
			fileName: 'react-bwin',
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime', 'bwin'],
		},
	},
})
