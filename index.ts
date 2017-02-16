#!/usr/bin/env node

import {xmppTest} from "./lib/xmppTest";

let applog  = require('debug')('xmpp');
let path    = require('path');

// Provide a title to the process in `ps`
let appRoot : string = path.resolve(__dirname);
process.title = 'xmppTest';

// Load Config
let xmppTestRunner = new xmppTest(applog,appRoot);

// Run
xmppTestRunner.run();
