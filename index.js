// node >= 8
// babel == 6 plugin

const t = require('babel-types');
// const { writeFile } = require('fs');
// const { promisify } = require('util');
// const cssToJss = require('jss-cli/lib/cssToJss');

const CssImport = require('./css-import-visitor');
const {
  jsStringToAst, constAst, postcss
} = require('./helpers');

/* main() { */

module.exports = function(/*babel*/) {
  // is plugin initialized?
  // const initialized = false;

  const pluginApi = {
    manipulateOptions (options) {
      // if (initialized) return options;
      return options;

      // e.g. { generateScopedName }
      // const currentConfig = { ...defaultOptions, ...retreiveOptions(options, pluginApi) };

      // TODO:
      // require('./postcss-hook')(currentConfig)
      // const initialized = true;
    },

    visitor: {
      ImportDeclaration: {
        exit: CssImport(({ src, css, options, importNode, babelData }) => {
          const postcssOptions = { generateScopedName: options.generateScopedName };
          const { code } = postcss.process(css, src, postcssOptions);

          babelData.replaceWith(putStyleIntoHeadAst({ code }));
        }),
      },
    },
  };
  return pluginApi;
};

/* } */

function putStyleIntoHeadAst({ code }) {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}
