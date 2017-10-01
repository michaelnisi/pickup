'use strict'

// nested - test nested items

const parse = require('./lib/parse')
const pickup = require('pickup')
const test = require('tap').test

test('nested item', (t) => {
  const xml = `<channel><item><item></item></item></channel>`
  const wanted = [
    ['entry', pickup.entry()],
    ['feed', pickup.feed()],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('nested feed', (t) => {
  const xml = `<channel><channel></channel><item></item></channel>`
  const wanted = [
    ['feed', pickup.feed()],
    ['entry', pickup.entry()],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
