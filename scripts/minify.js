const fs = require('fs');
const path = require('path');

const minify = require('minify');

const projectRoot = path.resolve(__dirname, '..');
const bundlePath = path.resolve(projectRoot, 'js/bundle.js')
const outputPath = path.resolve(projectRoot, 'js/bundle.min.js')

minify(bundlePath, function(error, minified) {
  if (error) return console.error(error.message);

  fs.writeFileSync(outputPath, minified)
});
