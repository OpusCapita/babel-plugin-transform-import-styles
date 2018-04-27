Replaces `import './styles.css'` with a loader which injects styles to HTML head.

Currently works with `.css` files.

Plugin respects webpack css-modules API and postcss config.

# Requirements
babel == 6, node >= 8

babel and postcss configs for best results

# Installation & configuration
```sh
npm i --save-dev babel-plugin-transform-import-styles
npm i --save-dev load-styles # puts styles into the head
```

**.babelrc** example:
```json5
{
  "sourceMaps": "inline",
  "presets": [
    ["env", {
      "targets": { "browsers": ["last 2 Chrome versions", "last 1 Safari version"] },
      "useBuiltIns": false, "modules": false
    }],
    "stage-1", "react"
  ],
  "plugins": [
    ["transform-import-styles"]
  ]
}
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

# Use Cases

Bundling the css with js/react components.
It is good for portability.

# TODO

Add support for `less` files.

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
