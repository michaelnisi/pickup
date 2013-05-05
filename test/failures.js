
// failures - test failures

var test = require('tap').test
  , fs = require('fs')
  , pickup = require('../')

test('null', function (t) {
  t.throws(function () { pickup().write(null) })
  t.end()
})

test('crap', function (t) {
  t.throws(function () { pickup().write('crap') })
  t.end()
})

test('invalid xml', function (t) {
  t.throws(function () { pickup().write('<xml><feed></xml>') })
  t.end()
})

test('empty string', function (t) {
  var p = pickup()
  p.write('')
  t.end()
  p.on('readable', function () {
    t.equals(p.read(), null)
    t.end()
  })
})

test('empty xml', function (t) {
  var p = pickup()
  p.write('<xml></xml>')
  p.end()
  p.on('readable', function () {
    t.equals(p.read(), null)
    t.end()
  })
})
