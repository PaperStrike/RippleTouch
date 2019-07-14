const fs = require('fs');
const minify = require('minify');

const js = fs.readFileSync(`${__dirname}/lib/Ripple.js`, 'utf8');
const template = fs.readFileSync(`${__dirname}/docs/index.xml`, 'utf8');

const jsVersion = js.match(/@version[^]*?\n/)[0].slice(9, -1);
const devScript = `<script src="eruda.min.js"></script><script>eruda.init();</script>`;

const userIndex = template.replace('<!-- @jsVersion -->', jsVersion);
const devIndex = userIndex.replace('<!-- @devScript -->', devScript);

module.exports = {
  save(minified = true) {
    /*
    fs.copyFile(`${__dirname}/lib/Ripple.min.js`, `${__dirname}/docs/Ripple.min.js`, (err) => {
      if (err) throw err;
      console.log('Script has been updated!');
    });
    */
    const minifiedJs = fs.readFileSync(`${__dirname}/lib/Ripple.min.js`, 'utf8');
    fs.writeFile(`${__dirname}/docs/Ripple.min.js`, minifiedJs, 'utf8', (err) => {
      if (err) throw err;
      console.log('Script has been updated!');
    });

    const userIndexToSave = minified ? minify.html(userIndex) : userIndex;
    const devIndexToSave = minified ? minify.html(devIndex) : devIndex;
    fs.writeFile(`${__dirname}/docs/index.html`, userIndexToSave, 'utf8', (err) => {
      if (err) throw err;
      console.log('Minified user index has been saved!');
    });
    fs.writeFile(`${__dirname}/docs/index.dev.html`, devIndexToSave, 'utf8', (err) => {
      if (err) throw err;
      console.log('Minified dev index has been saved!');
    });
  },
}
