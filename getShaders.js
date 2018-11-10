const fs = require('fs');
const files = fs.readdirSync('./src/js/mona/shader');

fs.writeFileSync('./src/js/weFlyGame/shaders.json', JSON.stringify(files.filter(function(name) {
  return /\.glsl$/.test(name)
}), null, 2));
