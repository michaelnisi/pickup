
// ab - ab test

var es = require('event-stream')
  , path = require('path')
  , fs = require('fs')
  , pickup = require('../')

module.exports = function (t, a, b) {
  var options = !!Math.round(Math.random()) ? { encoding:'utf8' } : null
    , reader = fs.createReadStream(a, options)
    , transformer = pickup()
    , expected = JSON.parse(fs.readFileSync(b))

  reader
    .pipe(transformer)
    .pipe(es.writeArray(function (err, lines) {
      t.deepEqual(JSON.parse(lines.join('')), expected)
      t.end()
    }))

  return transformer
}
