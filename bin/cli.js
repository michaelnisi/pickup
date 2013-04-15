#!/usr/bin/env node

;(function () {
  var pickup = require('../')
    , transformer = pickup()
    , Readable = require('stream').Readable
    , reader = new Readable().wrap(process.openStdin())
    , writer = process.stdout

  reader.pipe(transformer).pipe(writer)
})()
