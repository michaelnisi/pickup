'use strict'

// parse crazy rdf from way back when

const parse = require('./lib/parse')
const pickup = require('../')
const test = require('tap').test
const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, 'data', 'rdf.xml')
const xml = fs.readFileSync(p)

test('object mode', (t) => {
  const wanted = [
    ['data', pickup.entry({ title: 'Space Invaders' })],
    ['data', pickup.feed({ title: 'smartos-discuss' })],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({
    t: t,
    eventMode: false,
    objectMode: true,
    xml: xml,
    wanted: wanted
  }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('event mode', (t) => {
  const wanted = [
    ['entry', pickup.entry({ title: 'Space Invaders' })],
    ['feed', pickup.feed({ title: 'smartos-discuss' })],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
