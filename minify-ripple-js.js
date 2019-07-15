const fs = require('fs');
const minify = require('minify');

const js = fs.readFileSync(`${__dirname}/lib/Ripple.part.js`, 'utf8');
const css = fs.readFileSync(`${__dirname}/lib/Ripple.part.css`, 'utf8');
const jsInfo = `/**\n *${js.slice(js.indexOf(' @'), js.indexOf('*/'))}*/\n`;

const jsWithCss = js.replace("@css\`\`", `\`\n${css}\``);

let minifiedCss;
{
  // 1. Create tempCss which is able to be minified.
  let tempCss;

  // 1.1. Change forms of the brackets and comma.
  tempCss = css.replace(/\('/g, '-b-').replace(/'\)/g, '-d-');

  // 1.2. Change forms of '${}'.
  // Contents of '${}' in tempCss.
  let words;
  {
    words = tempCss.match(/(?<=\$\{)[^}]*(?=\})/g);

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
    tempCss = tempCss.replace(reg, tempWord);
  };

  // 2. Minify tempCss.
  const minifiedTempCss = minify.css(tempCss);

  // 3. Bring the forms back.
  // 3.1. Bring back '${}'.
  minifiedCss = minifiedTempCss;
  for (const word of words) {
    const tempWord = random[0] + word + random[1];
    const reg = new RegExp(tempWord, 'g');
    minifiedCss = minifiedCss.replace(reg, '${' + word + '}');
  };

  // 3.2. Bring back brackets and comma.
  minifiedCss = minifiedCss.replace(/-b-/g, "('").replace(/-d-/g, "')");
}

// Original JS with minified CSS.
let tempJs = js;
tempJs = js.replace("@css\`\`", `\`${minifiedCss}\``);

// Minified JS with minified CSS but info.
let minifiedJs = minify.js(tempJs);

module.exports = {
  save(type, withInfo = false) {
    switch(type) {
      case 'js':
        if (withInfo) {
          minifiedJs = jsInfo + minifiedJs + "\n";
        };
        fs.writeFile(`${__dirname}/lib/Ripple.js`, jsWithCss, 'utf8', (err) => {
          if (err) throw err;
          console.log('JS file with CSS has been saved!');
        });
        fs.writeFile(`${__dirname}/lib/Ripple.min.js`, minifiedJs, 'utf8', (err) => {
          if (err) throw err;
          console.log('Minified JS file with minified CSS has been saved!');
        });
        break;
      case 'css':
        fs.writeFile(`${__dirname}/lib/Ripple.min.css`, minifiedCss, 'utf8', (err) => {
          if (err) throw err;
          console.log('Minified CSS has been saved!');
        });
        break;
    }
  },
}
