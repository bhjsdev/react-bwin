import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [
		// Use `classic` for lower React versions e.g. 16
		react({ jsxRuntime: 'classic' }),
	],
	root: './dev',
	envDir: '../',
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		lib: {
			entry: '../src/index.tsx',
			name: 'ReactBinaryWindow',
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					'react': 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
})
