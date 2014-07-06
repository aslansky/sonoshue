#!/usr/bin/env node
'use strict';

var opts = require('nomnom')
  .option('debug', {
    abbr: 'd',
    flag: true,
    help: 'Print debugging info'
  })
  .option('localIp', {
    abbr: 'l',
    full: 'local-ip',
    help: 'Local ip address'
  })
  .parse();

require('../index')(opts);
