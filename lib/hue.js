var hue = require('node-hue-api');

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var api = null;
var device = null;
var user = '8dbcc202ea0931b6ad284c7cf2073709';
var lights = [1, 2, 3];
var debug = false;

function displayResult (result) {
  console.log(JSON.stringify(result, null, 2));
}

function error (err) {
  if (err.type === 101) {
    console.log('Failed to connect to hue bridge, press the button on the hue and try again.');
  }
  else {
    console.log(err);
  }
}

function connectBridge (b) {
  if (b && b.length) {
    if (debug) console.log('Found hue at ' + b[0].ipaddress);
    device = b[0];
    api = new HueApi(device.ipaddress, user);
    return api.connect();
  }
  else {
    process.kill('SIGINT');
  }
}


function checkUser (result) {
  if (!result.swupdate) {
    api = new HueApi();
    return api.registerUser(device.ipaddress, user, 'Sonos/Hue bridge');
  }
  else {
    return api.getFullState(device.ipaddress);
  }
}

function setLightColor (light, color) {
  if (debug) {
    console.log('Light ' + light + ' to hue ' + Math.round(color.hsl()[0]) + ', saturation ' + Math.round(color.hsl()[1] * 100) + ' and brightness ' + Math.round(color.hsl()[2] * 100));
    console.log('----------------------------------------');
  }
  var state;
  state = lightState.create().on().hsl(Math.round(color.hsl()[0]), Math.round(color.hsl()[1] * 100), Math.round(color.hsl()[2] * 100));
  api
    .setLightState(light, state)
    .fail(error)
    .done();
}

function displayInfo (result) {
  console.log('Bridge info:');
  console.log('\tname: ' + result.config.name);
  console.log('\tipaddress: ' + result.config.ipaddress);
  console.log('\tgateway: ' + result.config.gateway);
  console.log('');
  console.log('Connected lights:');
  for (var prop in result.lights) {
    var light = result.lights[prop];
    console.log('\tid: ' + prop + '\ton: ' + (light.state.on ? 'yes' : 'no') + '\tname: ' + light.name);
  }
}

module.exports = {
  init: function (opts, cb) {
    debug = opts.debug;
    if (opts.bulb) {
      lights = opts.bulb;
    }
    hue
      .locateBridges()
      .then(connectBridge)
      .then(checkUser)
      .then(function () {
        console.log('Connected to hue at ' + device.ipaddress);
      })
      .fail(error)
      .done(function () {
        cb(lights.length);
      });
  },
  info: function (opts) {
    api
      .getFullState()
      .then(displayInfo)
      .done();
  },
  set: function (colors) {
    lights.forEach(function (light, index) {
      if (colors[index]) {
        setLightColor(light, colors[index]);
      }
      else {
        setLightColor(light, colors[0]);
      }
    });
  }
};
