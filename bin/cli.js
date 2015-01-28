#!/usr/bin/env node

var pickup = require('../')

process.stdout.on('error', function () {})
process.stdin.pipe(pickup()).pipe(process.stdout)
