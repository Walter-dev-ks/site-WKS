import { build } from 'esbuild';
import { mkdir, cp, copyFile, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await cp('public', 'dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await build({ entryPoints: ['src/main.jsx'], bundle: true, minify: true, outdir: 'dist/assets', entryNames: 'main', jsx: 'automatic', external: ['/media/*'], define: { 'process.env.NODE_ENV': '"production"' }, target: ['es2020'], legalComments: 'none' });
console.log('WKS Systems: production build complete.');
