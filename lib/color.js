var ColorThief = require('color-thief');
var chroma = require('chroma-js');
var request = require('request');
var fs = require('fs');

var colorThief = new ColorThief();

function analyzeImage (num, cb) {
  var palette = colorThief.getPalette('track.image');
  fs.unlink('track.image');
  var values = [];
  palette.forEach(function (color, index) {
    if (index > num - 1) return;
    values.push(chroma(color, 'rgb'));
  });
  cb(values);
}

module.exports = {
  get: function (url, num, cb) {
    request(url)
      .pipe(fs.createWriteStream('track.image'))
      .on('close', function () {
        analyzeImage(num, cb);
      });
  },
  getWhite: function (num) {
    var c = [];
    for (i = 0; i < num; i++) {
      c.push(chroma(255, 255, 255));
    }
    return c;
  }

};
