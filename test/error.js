'use strict'

// We are not really interested in the errors, but we must end correctly.

const test = require('tap').test
const parse = require('./lib/parse')

test('whitespace', (t) => {
  const xml = 'wtf'
  const wanted = [
    ['error', new Error('Non-whitespace before first tag.')],
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
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted, size: Infinity }, (er) => {
    t.ok(!er)
    t.end()
  })
})
