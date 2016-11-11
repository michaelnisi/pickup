#!/usr/bin/env node

const pickup = require('../')

process.stdout.on('error', function () {})
process.stdin.pipe(pickup()).pipe(process.stdout)
