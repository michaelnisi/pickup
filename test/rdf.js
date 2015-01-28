
// parse crazy rdf from way back when

var parse = require('./lib/parse')
var pickup = require('../')
var test = require('tap').test

test('rdf in object mode', function (t) {
  parse({
    t: t
  , eventMode: false
  , xml:
    '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF>'
  + '<channel><title>smartos-discuss</title>'
  + '<items></items>'
  + '<item><title>Space Invaders</title></item>'
  + '</channel></rdf:RDF>'
  , wanted:[
      ['data', pickup.entry({ title: 'Space Invaders' })]
    , ['readable']
    , ['data', pickup.feed({ title: 'smartos-discuss' })]
    , ['readable']
    , ['finish']
    , ['end' ]
    ]
  }
  , function (er) {
    t.ok(!er)
    t.end()
  })
})

test('rdf in event mode', function (t) {
  parse({
    t: t
  , xml:
    '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF>'
  + '<channel><title>smartos-discuss</title>'
  + '<items></items>'
  + '<item><title>Space Invaders</title></item>'
  + '</channel></rdf:RDF>'
  , wanted:[
      ['entry', pickup.entry({ title: 'Space Invaders' })]
    , ['feed', pickup.feed({ title: 'smartos-discuss' })]
    , ['finish']
    , ['end']
    ]
  }
  , function (er) {
    t.ok(!er)
    t.end()
  })
})
