// executed as a child process by babel plugin
// expects .less file path as an argument

const fs = require('fs');
const path = require('path');
const less = require('less');

const file = process.argv[2];

less.render(fs.readFileSync(file, 'utf8'), {
  filename: path.resolve(file) // needed for relative @import paths in .less files
}).
  then(({ css }) => process.stdout.write(css)).
  catch(err => {
    throw err;
  });
