// parse <enclosure />

var fs = require('fs')
var pickup = require('../')
var parse = require('./lib/parse')
var test = require('tap').test

test('enclosure', function (t) {
  var xml = fs.readFileSync('./data/enclosure.xml')
  var wanted = [
    ['entry', pickup.entry({
      enclosure: { url: 'abc', type: undefined, length: undefined}})],
    ['feed'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
