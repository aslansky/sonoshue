var Listener = require('./sonos-listen');
var color = require('./color');
var xml2js = require('xml2js');
var sonos = require('sonos');

var Sonos = sonos.Sonos;
var xmlParse = xml2js.parseString;
var device = null;
var currentTrack = '';
var callback, session, listener = null, num;
var debug = false;
var opts = null;

require('shutdown-handler').on('exit', function(e) {
  e.preventDefault();
  if (listener) {
    listener.removeService(session, function (err, success) {
      if (debug) console.log('removed sonos service');
      process.exit(0);
    });
  }
});

function analyzeImage (err, t) {
  if (currentTrack.length === 0) {
    currentTrack = t.title;
  }
  if (t.albumArtURI) {
    var uri = 'http://' + device.host + ':' + device.port + t.albumArtURI;
    color.get(uri, num, setColors);
  }
  else {
    setColors(color.getWhite(num));
  }
}

function setColors (colors) {
  callback(colors);
}

function listen (device) {
  listener = new Listener(new Sonos(device.host), opts.localIp);
  listener.listen(function(err) {
    if (err) throw err;

    listener.addService('/MediaRenderer/AVTransport/Event', function(error, sid) {
      if (error) throw err;
      if (sid) {
        console.log('Connected to sonos at ' + device.host);
        session = sid;
      }
    });

    listener.on('serviceEvent', function(endpoint, sid, data) {
      xmlParse(data.LastChange, function (err, result) {
        if (result && result.Event && result.Event.InstanceID && result.Event.InstanceID[0]) {
          if (currentTrack !== result.Event.InstanceID[0].CurrentTrackURI[0].$.val && result.Event.InstanceID[0].TransportState[0].$.val === 'PLAYING') {
            currentTrack = result.Event.InstanceID[0].CurrentTrackURI[0].$.val;
            device.currentTrack(analyzeImage);
          }
          if (result.Event.InstanceID[0].TransportState[0].$.val === 'PAUSED_PLAYBACK') {
            currentTrack = '';
            setColors(color.getWhite(num));
          }
        }
      });
    });
  });
}

module.exports = function (o, numberOfLights, cb) {
  opts = o;
  debug = o.debug;
  num = numberOfLights;
  callback = cb;
  sonos.search(function(d) {
    device = d;
    listen(device);
  });
};
