var hue = require('./lib/hue');
var sonos = require('./lib/sonos');

function setLight (colors) {
  hue.set(colors);
}

module.exports = function (opts) {
  hue.init(opts, function (numberOfLights) {
    sonos(opts, numberOfLights, setLight);
  });
};
