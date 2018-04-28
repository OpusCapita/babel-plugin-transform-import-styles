// node >= 8
// babel == 6 plugin
const { basename } = require('path');
const babelTemplate = require('babel-template');
const CssImport = require('./css-import-visitor');
const postcss = require('./postcss');

const jsStringToAst = jsString => babelTemplate(jsString)({});

const putStyleIntoHeadAst = ({ code }) => {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}

// eslint-disable-next-line max-len
const addScopeComment = ({ code, libraryName, fileName }) => `/* ${libraryName} / ${fileName} */\n${code}`;

module.exports = function(/* babel*/) {
  const pluginApi = {
    manipulateOptions(options) {
      return options;
    },

    visitor: {
      ImportDeclaration: {
        exit: CssImport(({ src, css, options, importNode, babelData }) => {
          const { code } = postcss.process(css, src);
          const { libraryName } = options;
          const fileName = basename(src);

          babelData.replaceWith(putStyleIntoHeadAst({
            code: libraryName ?
              addScopeComment({ code, libraryName, fileName }) :
              code
          }));
        }),
      },
    },
  };
  return pluginApi;
};

