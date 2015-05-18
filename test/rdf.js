// parse crazy rdf from way back when

var parse = require('./lib/parse')
var pickup = require('../')
var test = require('tap').test
var fs = require('fs')
var path = require('path')

var p = path.join(__dirname, 'data', 'rdf.xml')
var xml = fs.readFileSync(p)

test('object mode', function (t) {
  var wanted = [
    ['data', pickup.entry({ title: 'Space Invaders' })],
    ['data', pickup.feed({ title: 'smartos-discuss' })],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({
    t: t,
    eventMode: false,
    objectMode: true,
    xml: xml,
    wanted: wanted
  }, function (er) {
    t.ok(!er)
    t.end()
  })
})

test('event mode', function (t) {
  var wanted = [
    ['entry', pickup.entry({ title: 'Space Invaders' })],
    ['feed', pickup.feed({ title: 'smartos-discuss' })],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
