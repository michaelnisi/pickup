'use strict'

// parse <media:thumbnail/>

const parse = require('./lib/parse')
const pickup = require('../')
const test = require('tap').test

test('media-thumbnail', (t) => {
  const xml = [
    '<rss><channel><item><media:thumbnail url="abc"/></item>',
    '</channel></rss>'
  ].join()
  const wanted = [
    ['entry', pickup.entry({ image: 'abc' })],
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
