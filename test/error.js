'use strict'

// We are not really interested in the errors, but we must end correctly.

const parse = require('./lib/parse')
const { test } = require('tap')

test('whitespace', (t) => {
  const xml = 'wtf'

  const wanted = [
    ['error', new Error('Non-whitespace before first tag.')],
    ['error', new Error('undefined:1:3: document must contain a root element.')],
    ['readable'],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted, size: Infinity }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('gibberish', (t) => {
  const xml = '<wtf>'

  const wanted = [
    ['error', new Error('undefined:1:5: unclosed tag: wtf')],
    ['readable'],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted, size: Infinity }, (er) => {
    t.ok(!er)
    t.end()
  })
})
