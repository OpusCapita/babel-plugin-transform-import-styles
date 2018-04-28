const { readFileSync } = require('fs');
const { resolve, join } = require('path');
const requireResolve = require('require-resolve');

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
      if (!node.source.value.endsWith('.css') && !node.source.value.endsWith('.less')) {
        return
      };

      const fileData = requireResolve(node.source.value, resolve(file.opts.filename));

      if (!fileData) {
        throw new Error(`Cannot resolve "${node.source.value}" in ${file.opts.filename}`);
      }

      const { src } = fileData;

      let css;

      if (node.source.value.endsWith('.less')) {
        // unfortunately babel is completely sync
        // we need to block while we compile .less
        css = require('child_process').execSync(
          `node ${join(__dirname, 'compile-less.js')} ${src}`,
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

