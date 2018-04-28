const less = require('less');

let lessContent = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    lessContent += chunk;
  }
});

process.stdin.on('end', () => {
  less.render(lessContent).
    then(({ css }) => process.stdout.write(css)).
    catch(err => {
      console.log('less.render error: \n');
      throw err;
    })
});

