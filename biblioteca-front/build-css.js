const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const fs = require('fs');
const path = require('path');

const input = './src/index.css';
const outputDir = './dist';
const outputFile = path.join(outputDir, 'output.css');

// Cria a pasta dist se não existir
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

fs.readFile(input, (err, css) => {
  if (err) throw err;
  postcss([tailwind])
    .process(css, { from: input, to: outputFile })
    .then(result => {
      fs.writeFileSync(outputFile, result.css);
      console.log('CSS gerado com sucesso!');
    })
    .catch(error => console.error(error));
});
