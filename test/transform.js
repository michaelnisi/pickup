
// transform - transform and test

var path = require('path')
  , fs = require('fs')
  , pickup = require('../')

module.exports = function (t, xml, json) {
  var options = !Math.round(Math.random()) ? { encoding:'utf8' } : null
    , reader = fs.createReadStream(xml, options)
    , transformer = pickup()
    , expected = JSON.parse(fs.readFileSync(json))
    , actual = ''

  reader
    .pipe(transformer)
    .on('finish', function () {
      t.deepEqual(JSON.parse(actual), expected)
      t.end()
    })

  var chunk
  transformer.on('readable', function () {
    while (null !== (chunk = transformer.read())) {
      actual += chunk
    }
  })

  return transformer
}
