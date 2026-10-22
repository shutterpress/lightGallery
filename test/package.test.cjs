const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');
const plugins = ['thumbnail', 'zoom', 'fullscreen', 'autoplay', 'likes', 'proofing', 'hash'];

test('the runtime has no dependencies, peers, or install-time build hooks', () => {
    assert.deepEqual(pkg.dependencies || {}, {});
    assert.deepEqual(pkg.peerDependencies || {}, {});
    for (const hook of ['preinstall', 'install', 'postinstall', 'prepare']) assert.equal(pkg.scripts[hook], undefined);
});

test('core and every Gallery / Gallery Pro plugin retain their UMD import paths', () => {
    assert.equal(typeof require(path.join(root, pkg.main)), 'function');
    assert.ok(fs.existsSync(path.join(root, pkg.typings)));
    for (const name of plugins) {
        assert.equal(typeof require(path.join(root, `dist/plugins/${name}/lg-${name}.umd.js`)), 'function');
    }
    assert.deepEqual(fs.readdirSync(path.join(root, 'dist/plugins')).filter(name => fs.existsSync(path.join(root, `dist/plugins/${name}/lg-${name}.umd.js`))).sort(), [...plugins].sort());
});

test('stylesheet font and image references resolve in the package', () => {
    const cssDir = path.join(root, 'dist/css');
    for (const file of fs.readdirSync(cssDir).filter(name => name.endsWith('.css'))) {
        const css = fs.readFileSync(path.join(cssDir, file), 'utf8');
        for (const [, url] of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
            if (/^(data:|https?:)/.test(url)) continue;
            const asset = url.split(/[?#]/)[0];
            assert.ok(fs.existsSync(path.resolve(cssDir, asset)), `${file}: missing ${asset}`);
        }
    }
});
