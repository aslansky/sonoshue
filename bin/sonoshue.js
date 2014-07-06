#!/usr/bin/env node
'use strict';

var parser = require('nomnom');
var path = require('path');
var sonoshue = require('../index');

parser
  .script('sonoshue')
  .option('debug', {
    abbr: 'd',
    flag: true,
    help: 'Print debugging info'
  });

parser
  .command('listen')
  .option('localIp', {
    abbr: 'l',
    full: 'local-ip',
    help: 'Local ip address'
  })
  .option('bulb', {
    abbr: 'b',
    full: 'bulb',
    default: [1,2,3],
    list: true,
    help: 'ID of one ore more bulbs that should be used (get ID from `$ sonoshue info`)'
  })
  .callback(function(opts) {
    opts.path = path.join(__dirname, '..');
    sonoshue.listen(opts);
  })
  .help('listens to sonos and changes bulb colors');

parser
  .command('info')
  .callback(function(opts) {
    opts.path = path.join(__dirname, '..');
    sonoshue.info(opts);
  })
  .help('shows info about hue bridge');

var opts = parser.parse();
