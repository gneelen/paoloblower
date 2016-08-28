const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(projectRoot, 'js/bundle.js')

const srcFiles = [
  'js/leaflet.js',
  'js/tabletop-1-3-5.min.js',
  'js/jquery-1.10.2.min.js',
  'js/bootstrap.min.js',
  'js/classie.js',
  'js/cbpAnimatedHeader.min.js',
  'js/scrollReveal.js',
  'js/imagesloaded.pkgd.min.js',
  'js/jquery.scrollTo.js',
  'js/jquery.nav.js',
  'js/custom.js'
]

const output = srcFiles.map((file) => {
  const filePath = path.resolve(projectRoot, file)
  return fs.readFileSync(filePath).toString()
}).reduce((previous, current) => {
  return `(${previous} ${current})(window, document)`
})

fs.writeFileSync(outputPath, output);
