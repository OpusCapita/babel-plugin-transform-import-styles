// node >= 8
// babel == 6 plugin
const { basename, join } = require('path');
const fs = require('fs');
const babelTemplate = require('babel-template');
const CssImport = require('./css-import-visitor');
const postcss = require('./postcss');

// read package name from package.json for annotation comments in <style> blocks
const cwd = process.cwd();
let packageName;
const packageFile = join(cwd, 'package.json');
if (fs.existsSync(packageFile)) {
  packageName = require(packageFile).name;
}

const jsStringToAst = jsString => babelTemplate(jsString)({});

const putStyleIntoHeadAst = ({ code }) => {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}

// eslint-disable-next-line max-len
const addScopeComment = ({ code, packageName, fileName }) => `/* ${packageName} / ${fileName} */\n${code}`;

module.exports = function(/* babel*/) {
  const pluginApi = {
    manipulateOptions(options) {
      return options;
    },

    visitor: {
      ImportDeclaration: {
        exit: CssImport(({ src, css, options, importNode, babelData }) => {
          const { code } = postcss.process(css, src);
          babelData.replaceWith(putStyleIntoHeadAst({
            code: packageName ?
              addScopeComment({ code, packageName, fileName: basename(src) }) :
              code
          }));
        }),
      },
    },
  };
  return pluginApi;
};

