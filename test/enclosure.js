// parse <enclosure />

var fs = require('fs')
var pickup = require('../')
var parse = require('./lib/parse')
var test = require('tap').test
var path = require('path')

test('enclosure', function (t) {
  var p = path.join(__dirname, 'data', 'enclosure.xml')
  var xml = fs.readFileSync(p)
  var wanted = [
    ['entry', pickup.entry({
      enclosure: { url: 'abc', type: undefined, length: undefined}})],
    ['feed'],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
