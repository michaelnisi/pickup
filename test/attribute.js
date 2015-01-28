
var attribute = require('../lib/attribute')
var test = require('tap').test

test('default', function (t) {
  t.is(attribute('unwanted', {}), undefined)
  t.end()
})

test('link enclosure', function (t) {
  var key = 'link'
    , rel = 'enclosure'
    , href = 'http://somewhere'
    , attr = { rel:rel, href:href }
    , expected = { url:href, type:undefined, length:undefined }
    , kv = attribute(key, attr)
    ;
  t.equals(kv[0], rel)
  t.deepEquals(kv[1], expected)
  t.end()
})

test('link payment', function (t) {
  var key = 'link'
    , rel = 'payment'
    , href = 'http://somewhere'
    , attr = { rel:rel, href:href }
    , kv = attribute(key, attr)
    ;
  t.equals(kv[0], rel)
  t.equals(kv[1], href)
  t.end()
})

test('link default', function (t) {
  var key = 'link'
    , href = 'http://somewhere'
    , attr = { href:href }
    , kv = attribute(key, attr)
    ;
  t.equals(kv[0], key)
  t.equals(kv[1], href)
  t.end()
})

test('image', function (t) {
  var key = 'image'
    , href = 'http://somewhere'
    , attr = { href:href }
    , kv = attribute(key, attr)
    ;
  t.equals(kv[0], key)
  t.equals(kv[1], href)
  t.end()
})
