'use strict'

// parse feed image

const parse = require('./lib/parse')
const test = require('tap').test

test('image', (t) => {
  const xml = [
    '<rss><channel>',
    '<itunes:image href="abc" />',
    '<media:thumbnail url="def" />',
    '<image><url>ghi</url></image>',
    '</channel></rss>'
  ].join()
  const wanted = [
    ['feed', {
      image: 'abc'
    }],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
