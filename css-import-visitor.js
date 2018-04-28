const { readFileSync } = require('fs');
const path = require('path');
const requireResolve = require('require-resolve');
const less = require('less');
const postcss = require('postcss');

const { defaultOptions } = require('./consts');

/**
 * Visitor for `import '*.css'` babel AST-nodes
 */
function CssImport(cb) {
  return (babelData, { file, opts = {} }) => {
    const { node } = babelData;
    errorBoundary(node.source.value, () => {
      if (!node.source.value.endsWith('.css') && !node.source.value.endsWith('.less')) return;

      const { src } = requireResolve(node.source.value, path.resolve(file.opts.filename));
      const content = readFileSync(src, 'utf8');

      let css = content;

      if (node.source.value.endsWith('.less')) {
        // unfortunately babel is completely sync
        // we need to block while we compile .less
        css = require('child_process').execSync(
          `node compile-less.js`,
          {
            cwd: __dirname,
            input: content,
            encoding: 'utf8'
          }
        )
      }

      // TODO: load postcss options and plugins
      const options = { ...defaultOptions, ...opts };

      cb({
        babelData,
        src,
        importNode: { ...node, ...node.specifiers[0] },
        options,
        css
      });
    });
  };
}

module.exports = CssImport;

function errorBoundary(cssFile, cb) {
  try {
    cb();
  } catch (e) {
    debugger; // eslint-disable-line no-debugger
    console.error(new Error(`babel-plugin-transform-import-styles: ${ cssFile }: ${ e.message }`));
    throw e;
  }
}
