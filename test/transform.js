
// transform - transform and test

var path = require('path')
  , fs = require('fs')
  , pickup = require('../')

module.exports = function (t, xml, json) {
  var options = !!Math.round(Math.random()) ? { encoding:'utf8' } : null
    , reader = fs.createReadStream(xml, options)
    , transformer = pickup()
    , expected = JSON.parse(fs.readFileSync(json))
    , actual = ''

  reader.pipe(transformer).on('end', function () {
    t.deepEqual(JSON.parse(actual), expected)
    t.end()
  })

  transformer.on('readable', function () {
    actual += transformer.read()
  })

  return transformer
}
