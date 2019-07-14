const fs = require('fs');
const minify = require('minify');

const js = fs.readFileSync(`${__dirname}/lib/Ripple.js`, 'utf8');
const css = js.match(/css`[^]*?`/)[0].slice(4, -1);
const jsInfo = `/**\n *${js.slice(js.indexOf(' @'), js.indexOf('*/'))}*/\n`;

let minifiedCSS;
{
  // 1. Create tempCSS which is able to be minified.
  let tempCSS;

  // 1.1. Change forms of the brackets and comma.
  tempCSS = css.replace(/\('/g, '-b-').replace(/'\)/g, '-d-');

  // 1.2. Change forms of '${}'.
  // Contents of '${}' in tempCSS.
  let words;
  {
    words = tempCSS.match(/(?<=\$\{)[^}]*(?=\})/g);

    // Remove duplicate items, prefix and suffix.
    words = words.sort().reduce((accumulator, current) => {
      const length = accumulator.length;
      if (length === 0 || accumulator[length - 1] !== current) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
  };

  // New forms of prefix and suffix.
  const random = ['u6g1k3', 'h2l9c8'];

  for (const word of words) {
    const tempWord = random[0] + word + random[1];
    const reg = new RegExp('\\${' + word + '}', 'g');
    tempCSS = tempCSS.replace(reg, tempWord);
  };

  // 2. Minify tempCSS.
  const minifiedTempCSS = minify.css(tempCSS);

  // 3. Bring the forms back.
  // 3.1. Bring back '${}'.
  minifiedCSS = minifiedTempCSS;
  for (const word of words) {
    const tempWord = random[0] + word + random[1];
    const reg = new RegExp(tempWord, 'g');
    minifiedCSS = minifiedCSS.replace(reg, '${' + word + '}');
  };

  // 3.2. Bring back brackets and comma.
  minifiedCSS = minifiedCSS.replace(/-b-/g, "('").replace(/-d-/g, "')");
}

// Original JS with minified CSS.
let tempJS = js;
tempJS = js.replace(css, minifiedCSS);

// Minified JS with minified CSS but info.
let minifiedJS = minify.js(tempJS);

module.exports = {
  code(type, withInfo = false) {
    switch (type) {
      case 'js':
        if (withInfo) {
          minifiedJS = jsInfo + minifiedJS + "\n";
        };
        return minifiedJS;
      case 'css':
        return minifiedCSS;
    }
  },

  save(type, withInfo = false) {
    switch(type) {
      case 'js':
        if (withInfo) {
          minifiedJS = jsInfo + minifiedJS + "\n";
        };
        fs.writeFile(`${__dirname}/lib/Ripple.min.js`, minifiedJS, 'utf8', (err) => {
          if (err) throw err;
          console.log('Minified JS file with minified CSS has been saved!');
        });
        break;
      case 'css':
        fs.writeFile(`${__dirname}/lib/Ripple.min.css`, minifiedCSS, 'utf8', (err) => {
          if (err) throw err;
          console.log('Minified CSS has been saved!');
        });
        break;
    }
  },
}
