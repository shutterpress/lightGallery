# Shutterpress lightGallery

A focused distribution of the lightGallery fork used by Shutterpress Gallery and
Gallery Pro. It ships the core, thumbnail, zoom, fullscreen, autoplay, likes,
proofing, and hash plugins, plus their CSS, fonts, images and TypeScript declarations.
Existing `dist/*.umd.js` and `dist/plugins/*/*.umd.js` import paths are preserved.

The package has **no runtime or peer dependencies** and no install-time build
hooks. npm, Video.js, React, framework adapters, the demo site and development
sources are not included in the package. The upstream sources remain in this
repository to make future fixes and upstream comparisons possible.

## Build and verify

Requires Node.js 20 or newer:

```sh
npm ci
npm run build
npm test
npm pack
```

The build uses the allowlist in `plugins-config-rollup.json`. It produces UMD,
ES module and minified bundles, declarations and only the styles used by
Shutterpress. The legacy Rollup configs and publishing helpers are not used.
Always rebuild and test before committing a distribution update.

## Install in a plugin without Git access

Copy the `.tgz` produced by `npm pack` into the consuming plugin's
`dependencies/` directory, then install it:

```sh
npm install --save-dev ./dependencies/lightgallery-2.9.1-shutterpress.1.tgz
```

Commit the archive together with `package.json` and `package-lock.json`. This
makes `npm ci` reproducible and avoids Git credentials, Git source restrictions
in npm 12, and remote archive availability. No `allow-git` override is needed.
The same archive can be used by Gallery and Gallery Pro. Refresh the committed
archive and lockfile when updating the fork.

Do not replace this package with the upstream registry package: likes, proofing
and the Shutterpress hash changes are specific to this fork.

## License and attribution

Based on [lightGallery](https://github.com/sachinchoolur/lightGallery),
copyright Sachin Neravath, with Shutterpress modifications. Distributed under
GPL v3; see [LICENSE](LICENSE). Original license banners are retained in bundles.
