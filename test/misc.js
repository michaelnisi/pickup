
var test = require('tap').test
  , pickup = require('../')
  ;

test('throws', function (t) {
  t.throws(function () { pickup().write(null) })
  t.throws(function () { pickup().write('crap') })
  t.throws(function () { pickup().write('<xml><feed></xml>') })
  t.end()
})
