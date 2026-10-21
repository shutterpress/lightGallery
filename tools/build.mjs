import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import * as sass from 'sass';
import { writeFile } from 'node:fs/promises';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const plugins = JSON.parse(await readFile('plugins-config-rollup.json', 'utf8'));
const entries = [
    { input: 'src/index.ts', output: 'dist/lightgallery', name: 'lightGallery' },
    ...plugins.map(({ folder, fileName }) => ({
        input: `src/${folder}${fileName}.ts`,
        output: `dist/${folder}${fileName}`,
        name: fileName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
    })),
];
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '--declaration', '--emitDeclarationOnly', '--outDir', 'dist', '--rootDir', 'src'], { stdio: 'inherit' });
for (const entry of entries) {
    const copyright = entry.name === 'lgProofing'
        ? 'Copyright (c) 2026 ShutterPress'
        : 'Copyright (c) 2020 Sachin Neravath';
    const banner = `/*! ${pkg.name} | ${pkg.version}\n * ${pkg.homepage}\n * ${copyright}\n * @license GPLv3\n */`;
    const bundle = await rollup({
        input: entry.input,
        plugins: [
            typescript({ noEmitOnError: true }),
            { name: 'normalize-lines', renderChunk(code) { return { code: code.replace(/[ \t\r]+$/gm, ''), map: null }; } },
        ],
        onwarn(warning, warn) {
            if (warning.code === 'UNRESOLVED_IMPORT') throw new Error(warning.message);
            warn(warning);
        },
    });
    try {
        await bundle.write({ file: `${entry.output}.umd.js`, name: entry.name, format: 'umd', banner });
        await bundle.write({ file: `${entry.output}.es5.js`, format: 'es', banner });
        await bundle.write({ file: `${entry.output}.min.js`, name: entry.name, format: 'umd', banner, plugins: [terser({ format: { comments: /^!/ } })] });
    } finally {
        await bundle.close();
    }
}
await mkdir('dist/css', { recursive: true });
const styles = ['lightgallery', 'lightgallery-core', 'lightgallery-bundle', 'lg-thumbnail', 'lg-zoom', 'lg-fullscreen', 'lg-autoplay', 'lg-transitions'];
for (const name of styles) {
    const filename = `src/scss/${name}.scss`;
    for (const [suffix, style] of [['.css', 'expanded'], ['.min.css', 'compressed']]) {
        const { css } = sass.compile(filename, { style, silenceDeprecations: ['color-functions', 'global-builtin', 'import'] });
        await writeFile(`dist/css/${name}${suffix}`, css);
    }
}
for (const name of ['fonts', 'images']) await cp(`src/${name}`, `dist/${name}`, { recursive: true });
// Keep SCSS available for theme builds, without shipping unused plugin styles.
await mkdir('dist/scss', { recursive: true });
for (const name of await readdir('src/scss')) {
    if (name.startsWith('_') || styles.some(style => `${style}.scss` === name) || name === 'transitions') {
        await cp(path.join('src/scss', name), path.join('dist/scss', name), { recursive: true });
    }
}
