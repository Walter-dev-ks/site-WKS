import { readFile, writeFile } from 'node:fs/promises';
const destination = process.argv[2] || 'WKS-Preview.html';
let html = await readFile('dist/index.html', 'utf8');
let css = await readFile('dist/assets/main.css', 'utf8');
let js = await readFile('dist/assets/main.js', 'utf8');
for (const [name, type] of [['inter-latin.woff2', 'font/woff2'], ['display.woff2', 'font/woff2'], ['barber.jpg', 'image/jpeg'], ['wks-logo.png', 'image/png'], ['wks-logo-official.jpeg', 'image/jpeg'], ['wks-logo-light.png', 'image/png']]) {
  const data = `data:${type};base64,${(await readFile(`public/media/${name}`)).toString('base64')}`;
  css = css.replaceAll(`/media/${name}`, data);
  js = js.replaceAll(`/media/${name}`, data);
}
html = html.replace(/\s*<link rel="preload"[^>]+>/g, '');
html = html.replace('<link rel="stylesheet" href="/assets/main.css" />', `<style>${css}</style>`);
html = html.replace('<script type="module" src="/assets/main.js"></script>', `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>`);
html = html.replace('/favicon.svg', `data:image/svg+xml;base64,${(await readFile('public/favicon.svg')).toString('base64')}`);
await writeFile(destination, html);
console.log(`Preview exported: ${destination}`);
