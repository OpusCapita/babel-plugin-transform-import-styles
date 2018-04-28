// node >= 8
// babel == 6 plugin
const babelTemplate = require('babel-template');
const CssImport = require('./css-import-visitor');
const postcss = require('./postcss');

const jsStringToAst = jsString => babelTemplate(jsString)({});

const putStyleIntoHeadAst = ({ code }) => {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}

module.exports = function(/*babel*/) {
  const pluginApi = {
    manipulateOptions (options) {
      return options;
    },

    visitor: {
      ImportDeclaration: {
        exit: CssImport(({ src, css, options, importNode, babelData }) => {
          const { code } = postcss.process(css, src);
          babelData.replaceWith(putStyleIntoHeadAst({ code }));
        }),
      },
    },
  };
  return pluginApi;
};



