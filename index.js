var hue = require('./lib/hue');

function setLight (colors) {
  hue.set(colors);
}

module.exports = {
  listen: function (opts) {
    hue.init(opts, function (numberOfLights) {
      require('./lib/sonos')(opts, numberOfLights, setLight);
    });
  },
  info: function (opts) {
    hue.init(opts, function () {
      hue.info(opts);
    });
  }
};
