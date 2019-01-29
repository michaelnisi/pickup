'use strict'

// encoding - test encoding detection

const pickup = require('../')
const { test } = require('tap')

test('guess encoding', (t) => {
  const f = pickup.cribEncoding

  const found = [
    f(''),
    f('<?xml?>'),
    f('<?xml encoding>'),
    f('<?xml encoding="UTF-8"?>'),
    f('<?xml encoding="utf-8"?>'),
    f('<?xml encoding="ISO-8859-1"?>'),
    f('<?xml encoding="iso-8859-1"?>')
  ]

  const wanted = [
    'utf8',
    'utf8',
    'utf8',
    'utf8',
    'utf8',
    'binary',
    'binary'
  ]

  t.plan(wanted.length)

  wanted.forEach((it, i) => {
    t.is(found[i], it)
  })
})

test('set encoding', (t) => {
  function go (objs) {
    const obj = objs.shift()
    if (!obj) return

    const parser = pickup({ charset: obj.charset })

    parser.on('readable', () => {
      while (parser.read()) {}
    })

    parser.on('encoding', (enc) => {
      t.is(enc, obj.encoding, 'should emit encoding')
    })

    parser.on('end', () => {
      go(objs)
    })

    parser.end(obj.xml)
  }

  const tests = [
    { xml: '<?xml version="1.0"?><feed></feed>', encoding: 'utf8' },
    { xml: '<?xml version="1.0" encoding="UTF-8"?><feed></feed>', encoding: 'utf8' },
    { xml: '<?xml version="1.0" encoding="ISO-8859-1"?><feed></feed>', encoding: 'binary' },
    { charset: 'joker', xml: '<?xml version="1.0"?><feed></feed>', encoding: 'utf8' }
  ]

  t.plan(tests.length)
  go(tests)
})
