// encoding - test encoding detection

var test = require('tap').test
var pickup = require('../')

test('guess encoding', function (t) {
  var f = pickup.cribEncoding
  var found = [
    f(''),
    f('<?xml?>'),
    f('<?xml encoding="UTF-8"?>'),
    f('<?xml encoding="utf-8"?>'),
    f('<?xml encoding="ISO-8859-1"?>'),
    f('<?xml encoding="iso-8859-1"?>')
  ]
  var wanted = [
    'utf8',
    'utf8',
    'utf8',
    'utf8',
    'binary',
    'binary'
  ]
  t.plan(wanted.length)
  wanted.forEach(function (it, i) {
    t.is(found[i], it)
  })
})

test('set encoding', function (t) {
  function go (objs) {
    var obj = objs.shift()
    if (!obj) return
    var parser = pickup({ charset: obj.charset })
    parser.on('readable', function () {
      while (parser.read()) {}
    })
    parser.on('encoding', function (enc) {
      t.is(enc, obj.encoding, 'should emit encoding')
    })
    parser.on('end', function () {
      go(objs)
    })
    parser.end(obj.xml)
  }
  var tests = [
    { xml: '<?xml?><feed></feed>', encoding: 'utf8' },
    { xml: '<?xml encoding="*"?><feed></feed>', encoding: 'utf8' },
    { xml: '<?xml encoding="UTF-8"?><feed></feed>', encoding: 'utf8' },
    { xml: '<?xml encoding="ISO-8859-1"?><feed></feed>', encoding: 'binary' },
    { charset: 'joker', xml: '<?xml?><feed></feed>', encoding: 'utf8' }
  ]
  t.plan(tests.length)
  go(tests)
})
