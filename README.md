Replaces `import './styles.css'` or `import './styles.less'` with a loader which injects styles to HTML head.

Currently works with `.css` and `.less` files (compiles `.less` to `.css` on the fly).

Afterwards all styles are processed by [autoprefixer](https://github.com/postcss/autoprefixer).

# Requirements
babel == 6, node >= 8

# Installation & configuration
```sh
npm i --save-dev babel-plugin-transform-import-styles
npm i --save-dev load-styles # puts styles into the head
```

# Usage

The following command will convert everything in the `src` folder to `lib` using babel and our plugin.

    babel src/ -d lib/ --presets stage-0,env,react --plugins transform-import-styles

Every js file that has a statement such as:

```js
import classes from './Component.css'
```

will be roughly translated to:

```js
require('load-styles')('.root{color:red}') // puts styles into the head
```

Example command to build a library using only babel:

```
babel src -s -D -d lib --presets es2015,stage-0,react --plugins transform-import-styles --ignore less,css,SCOPE.react.js,DOCUMENTATION.md --source-maps false
```
It will recursively transpile `src` directory and put all `.css` and `.less` files directly to `.js` files as descrived earlier. `--ignore` option is useful when you want to omit certain files in your production-ready build.

# Use Cases

Bundling the css with js/react components.
It is good for portability.

# Alternatives
- [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)
  - adds custom syntax
  - react specific
  - it isn't `export { classes }` friendly
- [babel-plugin-import-css-to-jss](https://github.com/websecurify/babel-plugin-import-css-to-jss)
  - breaks css-modules api (`import jssObject from './style.css'`)
- [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform)
  - genarates classes hash-map too
  - cannot bundle css-modules in js
