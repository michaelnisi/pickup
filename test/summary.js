'use strict'

// summary overrides description

const parse = require('./lib/parse')
const pickup = require('../')
const test = require('tap').test

test('rss', (t) => {
  const xml = [
    '<rss><channel>',
    '<item><description>abc</description><itunes:summary>def</itunes:summary></item>',
    '<item><itunes:summary>def</itunes:summary><description>abc</description></item>',
    '</channel></rss>'
  ].join()
  const wanted = [
    ['entry', pickup.entry({ summary: 'def' })],
    ['entry', pickup.entry({ summary: 'def' })],
    ['feed', {}],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('atom', (t) => {
  const xml = [
    '<feed>',
    '<entry><description>abc</description><summary>def</summary></entry>',
    '<entry><summary>def</summary><description>abc</description></entry>',
    '</feed>'
  ].join()
  const wanted = [
    ['entry', pickup.entry({ summary: 'def' })],
    ['entry', pickup.entry({ summary: 'def' })],
    ['feed', {}],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
