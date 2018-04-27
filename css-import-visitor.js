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

      // TODO: load postcss options and plugins
      const options = { ...defaultOptions, ...opts };

      const params = {
        babelData,
        src,
        importNode: { ...node, ...node.specifiers[0] },
        options,
        css
      }

      if (node.source.value.endsWith('.less')) {
        console.log('Trying less')
        less.render(content).
          then(result => {
            cb({
              ...params,
              css: result
            });
          })
      } else {
        cb(params);
      }
    });
  };
}

module.exports = CssImport;

function errorBoundary(cssFile, cb) {
  try {
    cb();
  } catch (e) {
    debugger; // eslint-disable-line no-debugger
    console.error(new Error(`import-css-to-jss-calls: ${ cssFile }: ${ e.message }`));
    throw e;
  }
}
