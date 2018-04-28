const { readFileSync } = require('fs');
const path = require('path');
const requireResolve = require('require-resolve');
const postcss = require('postcss');

function errorBoundary(cssFile, cb) {
  try {
    cb();
  } catch (e) {
    // debugger; // eslint-disable-line no-debugger
    console.error(new Error(`babel-plugin-transform-import-styles: ${ cssFile }: ${ e.message }`));
    throw e;
  }
}

/**
 * Visitor for `import '*.css'` babel AST-nodes
 */
function CssImport(cb) {
  return (babelData, { file, opts = {} }) => {
    const { node } = babelData;
    errorBoundary(node.source.value, () => {
      if (!node.source.value.endsWith('.css') && !node.source.value.endsWith('.less')) return;

      const { src } = requireResolve(node.source.value, path.resolve(file.opts.filename));

      console.log({ src })

      let css;

      if (node.source.value.endsWith('.less')) {
        // unfortunately babel is completely sync
        // we need to block while we compile .less
        css = require('child_process').execSync(
          `node ${path.join(__dirname, 'compile-less.js')} ${src}`,
          {
            cwd: __dirname,
            encoding: 'utf8'
          }
        )
      } else {
        css = readFileSync(src, 'utf8');
      }

      // TODO: load postcss options and plugins
      const options = { generateScopedName: '[local]', ...opts };

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

