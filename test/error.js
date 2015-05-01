// We are not really interested in the errors,
// but we must end correctly.

var test = require('tap').test
var parse = require('./lib/parse')

test('parse error', function (t) {
  var xml = 'wtf'
  var wanted = [
    ['error', new Error('Non-whitespace before first tag.')],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted, size: Infinity }, function (er) {
    t.ok(!er)
    t.end()
  })
})

test('parse error', function (t) {
  var xml = '<wtf>'
  var wanted = [
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted, size: Infinity }, function (er) {
    t.ok(!er)
    t.end()
  })
})
