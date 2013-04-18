
// failures - test failures

var test = require('tap').test
  , fs = require('fs')
  , pickup = require('../')

test('null', function (t) {
  var transformer = pickup()
  t.throws(function () { transformer.write(null) })
  t.notok(transformer.read(), 'should be null')
  t.end()
})

test('crap', function (t) {
  var transformer = pickup()
  t.throws(function () { transformer.write('crap') })
  t.notok(transformer.read(), 'should be null')
  t.end()
})

test('empty string', function (t) {
  var transformer = pickup()
  transformer.write('')
  t.notok(transformer.read(), 'should be null')
  t.end()
})

test('empty xml', function (t) {
  var transformer = pickup()
  transformer.write('<xml></xml>')
  transformer.end()
  t.notok(transformer.read(), 'should be null')
  t.end()
})
