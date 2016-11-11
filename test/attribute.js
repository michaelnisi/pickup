'use strict'

var attribute = require('../lib/attribute')
var test = require('tap').test

test('default', function (t) {
  t.is(attribute('unwanted', {}), undefined)
  t.end()
})

test('link enclosure', function (t) {
  var key = 'link'
  var rel = 'enclosure'
  var href = 'http: //somewhere'
  var attr = { rel: rel, href: href }
  var expected = { url: href, type: undefined, length: undefined }
  var kv = attribute(key, attr)
  t.equals(kv[0], rel)
  t.deepEquals(kv[1], expected)
  t.end()
})

test('link payment', function (t) {
  var key = 'link'
  var rel = 'payment'
  var href = 'http: //somewhere'
  var attr = { rel: rel, href: href }
  var kv = attribute(key, attr)
  t.equals(kv[0], rel)
  t.equals(kv[1], href)
  t.end()
})

test('link default', function (t) {
  var key = 'link'
  var href = 'http: //somewhere'
  var attr = { href: href }
  var kv = attribute(key, attr)
  t.equals(kv[0], key)
  t.equals(kv[1], href)
  t.end()
})

test('image', function (t) {
  var key = 'image'
  var href = 'http: //somewhere'
  var attr = { href: href }
  var kv = attribute(key, attr)
  t.equals(kv[0], key)
  t.equals(kv[1], href)
  t.end()
})
