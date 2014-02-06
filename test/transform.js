
// transform - transform and test

var path = require('path')
  , fs = require('fs')
  , Writable = require('stream').Writable
  , pickup = require('../')

module.exports = function (t, xml, json) {
  var options = !Math.round(Math.random()) ? { encoding:'utf8' } : null
    , reader = fs.createReadStream(xml, options)
    , transformer = pickup()
    , writer = new Writable()
    , expected = JSON.parse(fs.readFileSync(json))
    , actual = ''

  writer._write = function (chunk, enc, cb) {
    actual += chunk
    cb()
  }

  reader
    .pipe(transformer)
    .pipe(writer)
    .on('finish', function () {
      t.deepEqual(JSON.parse(actual), expected)
      t.end()
    })

  return transformer
}
