import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
	plugins: [
		// Use `classic` for lower React versions e.g. 16
		react({ jsxRuntime: 'classic' }),
		{
			name: 'generate-dts-file',
			closeBundle() {
				const srcFile = 'global.d.ts'
				const destFile = 'react-bwin.d.ts'
				fs.copyFileSync(
					path.resolve(__dirname, `src/${srcFile}`),
					path.resolve(__dirname, `dist/${destFile}`)
				)
				console.log(`✓ Copied d.ts file: ${srcFile} -> ${destFile}`)
			},
		},
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
