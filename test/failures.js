
// failures - test failures

var test = require('tap').test
  , es = require('event-stream')
  , pickup = require('../')

test('null', function (t) {
  var transformer = pickup()
  t.throws(function () { transformer.write(null) })
  t.end()
})

test('crap', function (t) {
  var transformer = pickup()
  t.throws(function () { transformer.write('crap') })
  t.end()
})

test('empty string', function (t) {
  var transformer = pickup()
  transformer.write('')
  t.end()
})
